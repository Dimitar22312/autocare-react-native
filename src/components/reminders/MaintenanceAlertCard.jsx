import {
    View,
    Text,
    StyleSheet,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';

export default function MaintenanceAlertCard({ alert }) {
    const isOverdue = alert.status === 'OVERDUE';

    const statusColor = isOverdue
        ? '#EF4444'
        : '#FF7A00';

    const statusBackground = isOverdue
        ? '#301F26'
        : '#332519';

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View
                    style={[
                        styles.iconContainer,
                        {
                            backgroundColor:
                                statusBackground,
                        },
                    ]}
                >
                    <Ionicons
                        name="warning-outline"
                        size={24}
                        color={statusColor}
                    />
                </View>

                <View style={styles.vehicleInfo}>
                    <Text style={styles.vehicleName}>
                        {alert.brand} {alert.model}
                    </Text>

                    <Text style={styles.serviceName}>
                        Oil Change
                    </Text>
                </View>

                <View
                    style={[
                        styles.statusBadge,
                        {
                            backgroundColor:
                                statusBackground,
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
                        {alert.status}
                    </Text>
                </View>
            </View>

            <View style={styles.divider} />

            <Text style={styles.message}>
                {alert.message}
            </Text>

            <View style={styles.footer}>
                <Ionicons
                    name="speedometer-outline"
                    size={17}
                    color="#9CA3AF"
                />

                <Text style={styles.footerText}>
                    Based on vehicle mileage
                </Text>
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
        marginBottom: 12,
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
        justifyContent: 'center',
        alignItems: 'center',
    },

    vehicleInfo: {
        flex: 1,
    },

    vehicleName: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
    },

    serviceName: {
        color: '#9CA3AF',
        fontSize: 12,
        marginTop: 5,
    },

    statusBadge: {
        paddingHorizontal: 10,
        paddingVertical: 7,
        borderRadius: 20,
    },

    statusText: {
        fontSize: 10,
        fontWeight: 'bold',
    },

    divider: {
        height: 1,
        backgroundColor: '#303641',
        marginVertical: 16,
    },

    message: {
        color: '#D1D5DB',
        fontSize: 14,
        lineHeight: 21,
    },

    footer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginTop: 16,
    },

    footerText: {
        color: '#9CA3AF',
        fontSize: 12,
    },
});