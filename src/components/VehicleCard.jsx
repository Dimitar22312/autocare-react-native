import { View, Text, StyleSheet, Pressable } from 'react-native';

import { theme } from '../theme/theme';

export default function VehicleCard({ vehicle, onPress }) {
    const mileage = Number(vehicle.mileage);
    const nextOilChange = Number(vehicle.nextOilChange);

    const remainingKm = nextOilChange - mileage;

    let serviceStatus = 'GOOD';
    let statusColor = theme.colors.success;
    let statusBackground = '#163A2A';

    if (remainingKm <= 0) {
        serviceStatus = 'OVERDUE';
        statusColor = theme.colors.danger;
        statusBackground = '#3D1F26';
    } else if (remainingKm <= 2000) {
        serviceStatus = 'DUE SOON';
        statusColor = theme.colors.primary;
        statusBackground = '#3D2B1B';
    }

    return (
        <Pressable
            onPress={onPress}
            style={({ pressed }) => [
                styles.card,
                pressed && styles.cardPressed,
            ]}
        >
            <View style={styles.header}>
                <View style={styles.vehicleIconContainer}>
                    <Text style={styles.vehicleIcon}>🚘</Text>
                </View>

                <View style={styles.vehicleInfo}>
                    <Text style={styles.vehicleName}>
                        {vehicle.brand} {vehicle.model}
                    </Text>

                    <Text style={styles.vehicleSubtitle}>
                        {vehicle.year} • {vehicle.fuelType}
                    </Text>
                </View>

                <Text style={styles.arrow}>›</Text>
            </View>

            <View style={styles.statusRow}>
                <View
                    style={[
                        styles.statusBadge,
                        { backgroundColor: statusBackground },
                    ]}
                />
                <View
                    style={[
                        styles.statusBadge,
                        {
                            backgroundColor: statusBackground,
                            borderColor: statusColor,
                        },
                    ]}
                >

                    <Text
                        style={[
                            styles.statusText,
                            { color: statusColor },
                        ]}
                    >
                        {serviceStatus}
                    </Text>
                </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.statsContainer}>
                <View style={styles.stat}>
                    <Text style={styles.statLabel}>
                        CURRENT MILEAGE
                    </Text>

                    <Text style={styles.statValue}>
                        {mileage.toLocaleString('en-US')}
                    </Text>

                    <Text style={styles.statUnit}>km</Text>
                </View>

                <View style={styles.verticalDivider} />

                <View style={styles.stat}>
                    <Text style={styles.statLabel}>
                        NEXT OIL CHANGE
                    </Text>

                    <Text style={styles.statValue}>
                        {nextOilChange.toLocaleString('en-US')}
                    </Text>

                    <Text style={styles.statUnit}>km</Text>
                </View>
            </View>

            <View style={styles.serviceContainer}>
                <Text style={styles.serviceIcon}>🔧</Text>

                <Text style={styles.serviceMessage}>
                    {remainingKm > 0
                        ? `${remainingKm.toLocaleString('en-US')} km until service`
                        : remainingKm === 0
                            ? 'Oil change is due now'
                            : `${Math.abs(remainingKm).toLocaleString('en-US')} km overdue`}
                </Text>
            </View>

            <View style={styles.footer}>
                <Text style={styles.detailsText}>
                    VIEW DETAILS
                </Text>

                <Text style={styles.detailsArrow}>→</Text>
            </View>
        </Pressable>
    );

}

const styles = StyleSheet.create({
    card: {
        backgroundColor: theme.colors.surface,
        borderRadius: theme.borderRadius.xl,
        padding: theme.spacing.lg,
        borderWidth: 1,
        borderColor: theme.colors.border,
    },

    cardPressed: {
        opacity: 0.85,
        transform: [{ scale: 0.99 }],
    },

    header: {
        flexDirection: 'row',
        alignItems: 'center',
    },

    vehicleIconContainer: {
        width: 60,
        height: 60,
        borderRadius: theme.borderRadius.lg,
        backgroundColor: theme.colors.surfaceLight,
        borderWidth: 1,
        borderColor: theme.colors.border,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: theme.spacing.md,
    },

    vehicleIcon: {
        fontSize: 28,
    },

    vehicleInfo: {
        flex: 1,
    },

    vehicleName: {
        color: theme.colors.text,
        fontSize: 21,
        fontWeight: 'bold',
        letterSpacing: -0.5,
    },

    vehicleSubtitle: {
        color: theme.colors.textSecondary,
        fontSize: 13,
        marginTop: theme.spacing.xs,
    },

    arrow: {
        color: theme.colors.primary,
        fontSize: 30,
        marginLeft: theme.spacing.sm,
    },

    statusRow: {
        marginTop: theme.spacing.lg,
        flexDirection: 'row',
    },

    statusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: theme.spacing.md,
        paddingVertical: theme.spacing.sm,
        borderRadius: theme.borderRadius.round,
        borderWidth: 1,
    },

    statusDot: {
        width: 8,
        height: 8,
        borderRadius: theme.borderRadius.round,
        marginRight: theme.spacing.sm,
    },

    statusText: {
        fontSize: 11,
        fontWeight: 'bold',
        letterSpacing: 1.2,
    },

    divider: {
        height: 1,
        backgroundColor: '#343A46',
        marginVertical: 20,
    },

    statsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: theme.spacing.xs,
    },

    stat: {
        flex: 1,
    },

    statLabel: {
        color: theme.colors.textSecondary,
        fontSize: 10,
        fontWeight: 'bold',
        letterSpacing: 0.8,
        marginBottom: theme.spacing.sm,
    },

    statValue: {
        color: theme.colors.text,
        fontSize: 24,
        fontWeight: 'bold',
        letterSpacing: -0.5,
    },

    statUnit: {
        color: '#9CA3AF',
        fontSize: 12,
        marginTop: 3,
    },

    verticalDivider: {
        width: 1,
        backgroundColor: '#343A46',
        marginHorizontal: 16,
    },

    serviceContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: theme.colors.background,
        padding: theme.spacing.md,
        borderRadius: theme.borderRadius.md,
        borderWidth: 1,
        borderColor: theme.colors.border,
        marginTop: theme.spacing.lg,
    },

    serviceIcon: {
        fontSize: 20,
        marginRight: theme.spacing.md,
    },

    serviceMessage: {
        color: theme.colors.textSecondary,
        fontSize: 13,
        fontWeight: '500',
        lineHeight: 20,
        flex: 1,
    },

    footer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        marginTop: theme.spacing.lg,
        paddingTop: theme.spacing.sm,
    },

    detailsText: {
        color: theme.colors.primary,
        fontSize: 11,
        fontWeight: 'bold',
        letterSpacing: 1.5,
    },
    detailsArrow: {
        color: theme.colors.primary,
        fontSize: 22,
        fontWeight: 'bold',
        marginLeft: theme.spacing.sm,
    },
});