import {
    createContext,
    useContext,
    useState,
    useEffect,
    useCallback,
    useRef,
} from 'react';

import {
    Alert,
    AppState,
} from 'react-native';

import AsyncStorage from
    '@react-native-async-storage/async-storage';

import { useAuth } from './AuthContext';
import { useVehicles } from './VehicleContext';
import { useReminders } from './ReminderContext';

import {
    requestNotificationPermission,
    syncReminderNotifications,
    sendTestNotification,
} from '../services/notificationService';

const NotificationContext = createContext(null);

function isNetworkError(error) {
    const message = [
        error?.message,
        error?.details,
    ]
        .filter(Boolean)
        .join(' ');

    return /fetch failed|failed to fetch|network request failed|network error|offline|internet connection/i.test(
        message
    );
}

export function NotificationProvider({ children }) {
    const { user } = useAuth();
    const { vehicles } = useVehicles();

    const {
        reminders,
        isLoading: remindersLoading,
        refreshReminders,
    } = useReminders();

    const [notificationsEnabled, setNotificationsEnabled] = useState(false);
    const [isInitializing, setIsInitializing] = useState(true);
    const [isUpdating, setIsUpdating] = useState(false);

    const syncQueue = useRef(Promise.resolve());

    const settingsKey = user?.id
        ? `autocare:notifications:${user.id}`
        : null;

    const queueSync = useCallback(
        (enabled, currentReminders, currentVehicles, userId) => {
            const task = syncQueue.current
                .catch(() => {})
                .then(() =>
                    syncReminderNotifications(
                        currentReminders,
                        currentVehicles,
                        userId,
                        enabled
                    )
                );

            syncQueue.current = task;

            return task;
        },
        []
    );

    useEffect(() => {
        let active = true;

        async function loadSettings() {
            setIsInitializing(true);

            try {
                const savedValue = settingsKey
                    ? await AsyncStorage.getItem(settingsKey)
                    : null;

                if (active) {
                    setNotificationsEnabled(
                        savedValue === 'true'
                    );
                }
            } catch (error) {
                console.error(
                    'Notification Settings Error:',
                    error
                );

                if (active) {
                    setNotificationsEnabled(false);
                }
            } finally {
                if (active) {
                    setIsInitializing(false);
                }
            }
        }

        loadSettings();

        return () => {
            active = false;
        };
    }, [settingsKey]);

    useEffect(() => {
        if (
            isInitializing ||
            remindersLoading ||
            !user?.id
        ) {
            return;
        }

        queueSync(
            notificationsEnabled,
            reminders,
            vehicles,
            user.id
        ).catch((error) => {
            console.error(
                'Notification Sync Error:',
                error
            );
        });

    }, [
        isInitializing,
        remindersLoading,
        notificationsEnabled,
        reminders,
        vehicles,
        user?.id,
        queueSync,
    ]);

    useEffect(() => {
        const subscription = AppState.addEventListener(
            'change',
            (state) => {
                if (state === 'active' && user?.id) {
                    refreshReminders().catch((error) => {
                        if (isNetworkError(error)) {
                            console.log(
                                'Reminder refresh skipped: device is offline.'
                            );

                            return;
                        }

                        console.error(
                            'Reminder Refresh Error:',
                            error
                        );
                    });
                }
            }
        );

        return () => {
            subscription.remove();
        };
    }, [user?.id, refreshReminders]);

    async function changeNotificationsEnabled(enabled) {
        if (isUpdating || !settingsKey) {
            return;
        }

        setIsUpdating(true);

        try {
            if (enabled) {
                const permissionGranted =
                    await requestNotificationPermission();

                if (!permissionGranted) {
                    Alert.alert(
                        'Permission Required',
                        'Please enable notifications in your phone settings.'
                    );

                    return;
                }
            }

            await AsyncStorage.setItem(
                settingsKey,
                String(enabled)
            );

            setNotificationsEnabled(enabled);

            await queueSync(
                enabled,
                reminders,
                vehicles,
                user.id
            );

        } catch (error) {
            Alert.alert(
                'Notification Error',
                error.message ||
                    'Unable to update notification settings.'
            );
        } finally {
            setIsUpdating(false);
        }
    }

    async function testNotification() {
        try {
            const permissionGranted =
                await requestNotificationPermission();

            if (!permissionGranted) {
                Alert.alert(
                    'Permission Required',
                    'Notification permission is required.'
                );

                return;
            }

            await sendTestNotification();

            Alert.alert(
                'Test Scheduled',
                'You should receive a test notification in approximately 5 seconds.'
            );

        } catch (error) {
            Alert.alert(
                'Test Failed',
                error.message ||
                    'Unable to schedule a test notification.'
            );
        }
    }

    const value = {
        notificationsEnabled,
        isInitializing,
        isUpdating,
        changeNotificationsEnabled,
        testNotification,
    };

    return (
        <NotificationContext.Provider value={value}>
            {children}
        </NotificationContext.Provider>
    );
}

export function useNotifications() {
    const context = useContext(NotificationContext);

    if (!context) {
        throw new Error(
            'useNotifications must be used inside NotificationProvider.'
        );
    }

    return context;
}