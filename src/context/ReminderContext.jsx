import {
    createContext,
    useContext,
    useState,
    useEffect,
    useCallback,
    useMemo,
} from 'react';

import { useAuth } from './AuthContext';
import { useVehicles } from './VehicleContext';

import { getReminders } from '../services/reminderService';

import {
    getMaintenanceAlerts,
} from '../utils/maintenanceAlerts';

const ReminderContext = createContext(null);

function getTodayString() {
    const date = new Date();

    const year = date.getFullYear();

    const month = String(
        date.getMonth() + 1
    ).padStart(2, '0');

    const day = String(
        date.getDate()
    ).padStart(2, '0');

    return `${year}-${month}-${day}`;
}

function getUpcomingLimitString() {
    const date = new Date();

    date.setHours(0, 0, 0, 0);
    date.setDate(date.getDate() + 7);

    const year = date.getFullYear();

    const month = String(
        date.getMonth() + 1
    ).padStart(2, '0');

    const day = String(
        date.getDate()
    ).padStart(2, '0');

    return `${year}-${month}-${day}`;
}

export function ReminderProvider({ children }) {
    const { user } = useAuth();
    const { vehicles } = useVehicles();

    const [reminders, setReminders] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const refreshReminders = useCallback(async () => {
        if (!user?.id) {
            setReminders([]);
            setIsLoading(false);
            return [];
        }

        setIsLoading(true);

        try {
            const data = await getReminders(user.id);

            setReminders(data);

            return data;
        } finally {
            setIsLoading(false);
        }
    }, [user?.id]);

    useEffect(() => {
        refreshReminders().catch((error) => {
            console.error(
                'Reminder loading error:',
                error
            );
        });
    }, [refreshReminders]);

    const maintenanceAlerts = useMemo(() => {
        return getMaintenanceAlerts(vehicles);
    }, [vehicles]);

    const badgeCount = useMemo(() => {
        const today = getTodayString();
        const upcomingLimit = getUpcomingLimitString();

        const importantReminders = reminders.filter(
            (reminder) => {
                if (reminder.is_completed) {
                    return false;
                }

                return reminder.due_date <= upcomingLimit;
            }
        );

        return (
            importantReminders.length +
            maintenanceAlerts.length
        );
    }, [reminders, maintenanceAlerts]);

    const value = {
        reminders,
        isLoading,
        maintenanceAlerts,
        badgeCount,
        refreshReminders,
    };

    return (
        <ReminderContext.Provider value={value}>
            {children}
        </ReminderContext.Provider>
    );
}

export function useReminders() {
    const context = useContext(ReminderContext);

    if (!context) {
        throw new Error(
            'useReminders must be used inside ReminderProvider.'
        );
    }

    return context;
}