import {
    useState,
    useEffect,
    useCallback,
} from 'react';

import {
    View,
    Text,
    ScrollView,
    Pressable,
    StyleSheet,
    ActivityIndicator,
    Alert,
    RefreshControl,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { useAuth } from '../context/AuthContext';
import { useVehicles } from '../context/VehicleContext';
import { useReminders } from '../context/ReminderContext';

import ReminderCard from '../components/reminders/ReminderCard';
import ReminderForm from '../components/reminders/ReminderForm';
import MaintenanceAlertCard from '../components/reminders/MaintenanceAlertCard';
import NotificationSettings from '../components/reminders/NotificationSettings';

import { getMaintenanceAlerts } from '../utils/maintenanceAlerts';

import {
    createReminder,
    updateReminder,
    toggleReminderCompleted,
    deleteReminder,
} from '../services/reminderService';

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

export default function RemindersScreen() {
    const { user } = useAuth();
    const { vehicles } = useVehicles();

    const { reminders, refreshReminders } = useReminders();

    const [isLoading, setIsLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);

    const [showForm, setShowForm] = useState(false);
    const [reminderToEdit, setReminderToEdit] =
        useState(null);

    const maintenanceAlerts =
        getMaintenanceAlerts(vehicles);

    const today = getTodayString();

    const overdueReminders = reminders.filter(
        reminder =>
            !reminder.is_completed &&
            reminder.due_date < today
    );

    const upcomingReminders = reminders.filter(
        reminder =>
            !reminder.is_completed &&
            reminder.due_date >= today
    );

    const completedReminders = reminders.filter(
        reminder => reminder.is_completed
    );

    const loadReminders = useCallback(
        async (refresh = false) => {
            if (!user?.id) {
                setIsLoading(false);
                setIsRefreshing(false);
                return;
            }

            if (refresh) {
                setIsRefreshing(true);
            } else {
                setIsLoading(true);
            }

            try {
                await refreshReminders();
            } catch (error) {
                Alert.alert(
                    'Error',
                    error.message ||
                        'Unable to load reminders.'
                );
            } finally {
                setIsLoading(false);
                setIsRefreshing(false);
            }
        },
        [user?.id, refreshReminders]
    );

    useEffect(() => {
        loadReminders();
    }, [loadReminders]);

    function openCreateForm() {
        setReminderToEdit(null);
        setShowForm(true);
    }

    function openEditForm(reminder) {
        setReminderToEdit(reminder);
        setShowForm(true);
    }

    function closeForm() {
        if (isSaving) {
            return;
        }

        setShowForm(false);
        setReminderToEdit(null);
    }

    async function saveReminderHandler(reminderData) {
        if (isSaving || !user?.id) {
            return;
        }

        setIsSaving(true);

        try {
            if (reminderToEdit) {
                await updateReminder(
                    user.id,
                    reminderToEdit.id,
                    reminderData
                );
            } else {
                await createReminder(
                    user.id,
                    reminderData
                );
            }

            setShowForm(false);
            setReminderToEdit(null);

            await loadReminders();
        } catch (error) {
            Alert.alert(
                'Save Error',
                error.message ||
                    'Unable to save reminder.'
            );
        } finally {
            setIsSaving(false);
        }
    }

    async function toggleCompletedHandler(reminder) {
        if (isUpdating || !user?.id) {
            return;
        }

        setIsUpdating(true);

        try {
            await toggleReminderCompleted(
                user.id,
                reminder.id,
                !reminder.is_completed
            );

            await loadReminders();
        } catch (error) {
            Alert.alert(
                'Update Error',
                error.message ||
                    'Unable to update reminder.'
            );
        } finally {
            setIsUpdating(false);
        }
    }

    function deleteReminderHandler(reminder) {
        if (isUpdating || !user?.id) {
            return;
        }

        Alert.alert(
            'Delete Reminder',
            'Are you sure you want to delete this reminder?',
            [
                {
                    text: 'Cancel',
                    style: 'cancel',
                },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                        setIsUpdating(true);

                        try {
                            await deleteReminder(
                                user.id,
                                reminder.id
                            );

                            await loadReminders();
                        } catch (error) {
                            Alert.alert(
                                'Delete Error',
                                error.message ||
                                    'Unable to delete reminder.'
                            );
                        } finally {
                            setIsUpdating(false);
                        }
                    },
                },
            ]
        );
    }

    function renderReminder(reminder) {
        const vehicle = vehicles.find(
            item => item.id === reminder.vehicle_id
        );

        return (
            <ReminderCard
                key={reminder.id}
                reminder={reminder}
                vehicle={vehicle}
                onEdit={() => openEditForm(reminder)}
                onDelete={() =>
                    deleteReminderHandler(reminder)
                }
                onToggleCompleted={() =>
                    toggleCompletedHandler(reminder)
                }
                disabled={isUpdating || isSaving}
            />
        );
    }

    function renderSection(title, items, color) {
        if (items.length === 0) {
            return null;
        }

        return (
            <View style={styles.section}>
                <View style={styles.sectionHeader}>
                    <View
                        style={[
                            styles.sectionDot,
                            {
                                backgroundColor: color,
                            },
                        ]}
                    />

                    <Text style={styles.sectionTitle}>
                        {title}
                    </Text>

                    <View style={styles.countBadge}>
                        <Text style={styles.countText}>
                            {items.length}
                        </Text>
                    </View>
                </View>

                {items.map(renderReminder)}
            </View>
        );
    }

    return (
        <SafeAreaView
            style={styles.safeArea}
            edges={['top', 'left', 'right']}
        >
            <KeyboardAvoidingView
                style={styles.flex}
                behavior={
                    Platform.OS === 'ios'
                        ? 'padding'
                        : undefined
                }
            >
                <ScrollView
                    contentContainerStyle={styles.content}
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                    refreshControl={
                        <RefreshControl
                            refreshing={isRefreshing}
                            onRefresh={() =>
                                loadReminders(true)
                            }
                            tintColor="#FF7A00"
                        />
                    }
                >
                    <View style={styles.pageHeader}>
                        <View>
                            <Text style={styles.eyebrow}>
                                AUTOCARE ALERTS
                            </Text>

                            <Text style={styles.pageTitle}>
                                Reminders
                            </Text>

                            <Text style={styles.subtitle}>
                                Stay ahead of maintenance.
                            </Text>
                        </View>

                        <Ionicons
                            name="notifications-outline"
                            size={34}
                            color="#FF7A00"
                        />
                    </View>

                    <View style={styles.summaryCard}>
                        <View style={styles.summaryIcon}>
                            <Ionicons
                                name="notifications"
                                size={29}
                                color="#FF7A00"
                            />
                        </View>

                        <View style={styles.summaryInfo}>
                            <Text style={styles.summaryValue}>
                                {overdueReminders.length +
                                    upcomingReminders.length +
                                    maintenanceAlerts.length}
                            </Text>

                            <Text style={styles.summaryLabel}>
                                Active Alerts
                            </Text>
                        </View>
                    </View>

                    <NotificationSettings />

                    {maintenanceAlerts.length > 0 && (
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>
                                Maintenance Alerts
                            </Text>

                            <Text style={styles.sectionSubtitle}>
                                Automatically calculated
                                from vehicle mileage.
                            </Text>

                            {maintenanceAlerts.map(alert => (
                                <MaintenanceAlertCard
                                    key={alert.id}
                                    alert={alert}
                                />
                            ))}
                        </View>
                    )}

                    <View style={styles.remindersHeader}>
                        <Text style={styles.sectionTitle}>
                            My Reminders
                        </Text>

                        {!showForm && vehicles.length > 0 && (
                            <Pressable
                                style={styles.addButton}
                                onPress={openCreateForm}
                            >
                                <Ionicons
                                    name="add"
                                    size={22}
                                    color="#FFFFFF"
                                />

                                <Text style={styles.addButtonText}>
                                    Add
                                </Text>
                            </Pressable>
                        )}
                    </View>

                    {showForm && (
                        <ReminderForm
                            vehicles={vehicles}
                            reminderToEdit={reminderToEdit}
                            onSave={saveReminderHandler}
                            onCancel={closeForm}
                            isSaving={isSaving}
                        />
                    )}

                    {isLoading ? (
                        <ActivityIndicator
                            size="large"
                            color="#FF7A00"
                            style={styles.loader}
                        />
                    ) : vehicles.length === 0 ? (
                        <View style={styles.emptyCard}>
                            <Ionicons
                                name="car-sport-outline"
                                size={50}
                                color="#FF7A00"
                            />

                            <Text style={styles.emptyTitle}>
                                No vehicles yet
                            </Text>

                            <Text style={styles.emptyText}>
                                Add a vehicle in My Garage
                                to create reminders.
                            </Text>
                        </View>
                    ) : reminders.length === 0 && !showForm ? (
                        <View style={styles.emptyCard}>
                            <Ionicons
                                name="notifications-off-outline"
                                size={50}
                                color="#FF7A00"
                            />

                            <Text style={styles.emptyTitle}>
                                No custom reminders
                            </Text>

                            <Text style={styles.emptyText}>
                                Create your first reminder
                                to stay on schedule.
                            </Text>
                        </View>
                    ) : (
                        <>
                            {renderSection(
                                'Overdue',
                                overdueReminders,
                                '#EF4444'
                            )}

                            {renderSection(
                                'Upcoming',
                                upcomingReminders,
                                '#FF7A00'
                            )}

                            {renderSection(
                                'Completed',
                                completedReminders,
                                '#22C55E'
                            )}
                        </>
                    )}
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    flex: {
        flex: 1,
    },

    safeArea: {
        flex: 1,
        backgroundColor: '#0F1117',
    },

    content: {
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 40,
    },

    pageHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 28,
    },

    eyebrow: {
        color: '#FF7A00',
        fontSize: 11,
        fontWeight: 'bold',
        letterSpacing: 2,
        marginBottom: 9,
    },

    pageTitle: {
        color: '#FFFFFF',
        fontSize: 34,
        fontWeight: 'bold',
    },

    subtitle: {
        color: '#9CA3AF',
        fontSize: 13,
        marginTop: 8,
    },

    summaryCard: {
        backgroundColor: '#1C212B',
        borderWidth: 1,
        borderColor: '#303641',
        borderRadius: 20,
        padding: 20,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 18,
        marginBottom: 32,
    },

    summaryIcon: {
        width: 60,
        height: 60,
        borderRadius: 17,
        backgroundColor: '#332519',
        justifyContent: 'center',
        alignItems: 'center',
    },

    summaryInfo: {
        flex: 1,
    },

    summaryValue: {
        color: '#FFFFFF',
        fontSize: 30,
        fontWeight: 'bold',
    },

    summaryLabel: {
        color: '#9CA3AF',
        fontSize: 13,
        marginTop: 4,
    },

    section: {
        marginBottom: 26,
    },

    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        marginBottom: 16,
    },

    sectionDot: {
        width: 9,
        height: 9,
        borderRadius: 5,
    },

    sectionTitle: {
        color: '#FFFFFF',
        fontSize: 19,
        fontWeight: 'bold',
    },

    sectionSubtitle: {
        color: '#9CA3AF',
        fontSize: 12,
        marginTop: 8,
        marginBottom: 18,
    },

    countBadge: {
        backgroundColor: '#252B36',
        borderRadius: 9,
        paddingHorizontal: 10,
        paddingVertical: 5,
    },

    countText: {
        color: '#FFFFFF',
        fontSize: 12,
        fontWeight: 'bold',
    },

    remindersHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },

    addButton: {
        backgroundColor: '#FF7A00',
        borderRadius: 11,
        paddingHorizontal: 15,
        paddingVertical: 10,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },

    addButtonText: {
        color: '#FFFFFF',
        fontSize: 13,
        fontWeight: 'bold',
    },

    emptyCard: {
        backgroundColor: '#1C212B',
        borderWidth: 1,
        borderColor: '#303641',
        borderRadius: 20,
        padding: 30,
        alignItems: 'center',
        gap: 12,
    },

    emptyTitle: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: 'bold',
    },

    emptyText: {
        color: '#9CA3AF',
        fontSize: 14,
        lineHeight: 21,
        textAlign: 'center',
    },

    loader: {
        marginVertical: 35,
    },
});