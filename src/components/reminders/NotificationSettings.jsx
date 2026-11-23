import {
    View,
    Text,
    Switch,
    Pressable,
    StyleSheet,
    ActivityIndicator,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';

import {
    useNotifications,
} from '../../context/NotificationContext';

export default function NotificationSettings() {
    const {
        notificationsEnabled,
        isInitializing,
        isUpdating,
        changeNotificationsEnabled,
        testNotification,
    } = useNotifications();

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={styles.iconContainer}>
                    <Ionicons
                        name="notifications-outline"
                        size={23}
                        color="#FF7A00"
                    />
                </View>

                <View style={styles.headerText}>
                    <Text style={styles.title}>
                        Notifications
                    </Text>

                    <Text style={styles.subtitle}>
                        Never miss important maintenance
                    </Text>
                </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.settingRow}>
                <View style={styles.settingInfo}>
                    <Text style={styles.settingTitle}>
                        Enable Notifications
                    </Text>

                    <Text style={styles.settingDescription}>
                        Get reminders before their due date
                    </Text>
                </View>

                {isInitializing || isUpdating ? (
                    <ActivityIndicator
                        color="#FF7A00"
                    />
                ) : (
                    <Switch
                        value={notificationsEnabled}
                        onValueChange={
                            changeNotificationsEnabled
                        }
                        trackColor={{
                            false: '#303641',
                            true: '#FF7A00',
                        }}
                        thumbColor="#FFFFFF"
                    />
                )}
            </View>

            <View style={styles.divider} />

            <View style={styles.scheduleRow}>
                <Ionicons
                    name="time-outline"
                    size={19}
                    color="#FF7A00"
                />

                <Text style={styles.scheduleText}>
                    Scheduled for 9:00 AM,
                    one day before the due date
                </Text>
            </View>

            {notificationsEnabled && (
                <Pressable
                    style={styles.testButton}
                    onPress={testNotification}
                    disabled={isUpdating}
                >
                    <Ionicons
                        name="send-outline"
                        size={19}
                        color="#FF7A00"
                    />

                    <Text style={styles.testButtonText}>
                        Send Test Notification
                    </Text>
                </Pressable>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#1C212B',
        borderWidth: 1,
        borderColor: '#303641',
        borderRadius: 20,
        padding: 20,
        marginBottom: 30,
    },

    header: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },

    iconContainer: {
        width: 46,
        height: 46,
        borderRadius: 13,
        backgroundColor: '#332519',
        justifyContent: 'center',
        alignItems: 'center',
    },

    headerText: {
        flex: 1,
    },

    title: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: 'bold',
    },

    subtitle: {
        color: '#9CA3AF',
        fontSize: 12,
        marginTop: 5,
    },

    divider: {
        height: 1,
        backgroundColor: '#303641',
        marginVertical: 18,
    },

    settingRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 12,
    },

    settingInfo: {
        flex: 1,
    },

    settingTitle: {
        color: '#FFFFFF',
        fontSize: 15,
        fontWeight: '600',
    },

    settingDescription: {
        color: '#9CA3AF',
        fontSize: 12,
        lineHeight: 18,
        marginTop: 5,
    },

    scheduleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },

    scheduleText: {
        color: '#9CA3AF',
        fontSize: 12,
        flex: 1,
        lineHeight: 18,
    },

    testButton: {
        backgroundColor: '#332519',
        borderWidth: 1,
        borderColor: '#FF7A00',
        borderRadius: 12,
        paddingVertical: 14,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 10,
        marginTop: 20,
    },

    testButtonText: {
        color: '#FF7A00',
        fontSize: 14,
        fontWeight: 'bold',
    },
});