import {
    View,
    Text,
    Pressable,
    StyleSheet,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';

export default function ReminderCard({
    reminder,
    vehicle,
    onEdit,
    onDelete,
    onToggleCompleted,
    disabled = false,
}) {
    const isCompleted = reminder.is_completed;

    const today = new Date();

    const year = today.getFullYear();

    const month = String(
        today.getMonth() + 1
    ).padStart(2, '0');

    const day = String(
        today.getDate()
    ).padStart(2, '0');

    const todayString = `${year}-${month}-${day}`;

    const isOverdue =
        !isCompleted &&
        reminder.due_date < todayString;

    const status = isCompleted
        ? 'COMPLETED'
        : isOverdue
            ? 'OVERDUE'
            : 'UPCOMING';

    const statusColor = isCompleted
        ? '#22C55E'
        : isOverdue
            ? '#EF4444'
            : '#FF7A00';

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={styles.iconContainer}>
                    <Ionicons
                        name={
                            isCompleted
                                ? 'checkmark-circle-outline'
                                : 'notifications-outline'
                        }
                        size={24}
                        color="#FF7A00"
                    />
                </View>

                <View style={styles.titleContainer}>
                    <Text style={styles.title}>
                        {reminder.title}
                    </Text>

                    <Text style={styles.vehicleName}>
                        {vehicle
                            ? `${vehicle.brand} ${vehicle.model}`
                            : 'Vehicle'}
                    </Text>
                </View>
            </View>

            <View style={styles.details}>
                <View style={styles.dateRow}>
                    <Ionicons
                        name="calendar-outline"
                        size={18}
                        color="#9CA3AF"
                    />

                    <Text style={styles.dateText}>
                        {reminder.due_date}
                    </Text>
                </View>

                <View
                    style={[
                        styles.statusBadge,
                        {
                            borderColor: statusColor,
                        },
                    ]}
                >
                    <Text
                        style={[
                            styles.statusText,
                            {
                                color: statusColor,
                            },
                        ]}
                    >
                        {status}
                    </Text>
                </View>
            </View>

            {!!reminder.description && (
                <Text style={styles.description}>
                    {reminder.description}
                </Text>
            )}

            <View style={styles.divider} />

            <View style={styles.actions}>
                <Pressable
                    style={styles.completeButton}
                    onPress={onToggleCompleted}
                    disabled={disabled}
                >
                    <Ionicons
                        name={
                            isCompleted
                                ? 'arrow-undo-outline'
                                : 'checkmark-circle-outline'
                        }
                        size={19}
                        color="#22C55E"
                    />

                    <Text style={styles.completeText}>
                        {isCompleted
                            ? 'Reopen'
                            : 'Complete'}
                    </Text>
                </Pressable>

                <Pressable
                    style={styles.actionButton}
                    onPress={onEdit}
                    disabled={disabled}
                >
                    <Ionicons
                        name="create-outline"
                        size={20}
                        color="#FF7A00"
                    />
                </Pressable>

                <Pressable
                    style={styles.actionButton}
                    onPress={onDelete}
                    disabled={disabled}
                >
                    <Ionicons
                        name="trash-outline"
                        size={20}
                        color="#EF4444"
                    />
                </Pressable>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#1C212B',
        borderWidth: 1,
        borderColor: '#303641',
        borderRadius: 18,
        padding: 18,
        marginBottom: 14,
    },

    header: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },

    iconContainer: {
        width: 46,
        height: 46,
        backgroundColor: '#332519',
        borderRadius: 13,
        justifyContent: 'center',
        alignItems: 'center',
    },

    titleContainer: {
        flex: 1,
    },

    title: {
        color: '#FFFFFF',
        fontSize: 17,
        fontWeight: 'bold',
    },

    vehicleName: {
        color: '#9CA3AF',
        fontSize: 13,
        marginTop: 5,
    },

    details: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 18,
    },

    dateRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },

    dateText: {
        color: '#D1D5DB',
        fontSize: 13,
    },

    statusBadge: {
        borderWidth: 1,
        borderRadius: 20,
        paddingHorizontal: 10,
        paddingVertical: 6,
    },

    statusText: {
        fontSize: 10,
        fontWeight: 'bold',
    },

    description: {
        color: '#9CA3AF',
        fontSize: 13,
        lineHeight: 20,
        marginTop: 16,
    },

    divider: {
        height: 1,
        backgroundColor: '#303641',
        marginVertical: 16,
    },

    actions: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },

    completeButton: {
        flex: 1,
        backgroundColor: '#17362A',
        borderRadius: 10,
        paddingVertical: 11,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 8,
    },

    completeText: {
        color: '#22C55E',
        fontSize: 13,
        fontWeight: 'bold',
    },

    actionButton: {
        width: 44,
        height: 44,
        backgroundColor: '#252B36',
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
});