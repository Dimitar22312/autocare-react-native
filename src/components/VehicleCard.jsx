import { View, Text, StyleSheet, Pressable } from 'react-native';

export default function VehicleCard({ vehicle, onPress }) {
    const mileage = Number(vehicle.mileage);
    const nextOilChange = Number(vehicle.nextOilChange);

    const remainingKm = nextOilChange - mileage;

    let serviceStatus = 'GOOD';
    let statusColor = '#22C55E';
    let statusBackground = '#163A2A';

    if (remainingKm <= 0) {
        serviceStatus = 'OVERDUE';
        statusColor = '#EF4444';
        statusBackground = '#3D1F26';
    } else if (remainingKm <= 2000) {
        serviceStatus = 'DUE SOON';
        statusColor = '#FF7A00';
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
                >
                    <View
                        style={[
                            styles.statusDot,
                            { backgroundColor: statusColor },
                        ]}
                    />

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
        backgroundColor: '#1C212B',
        borderRadius: 22,
        padding: 20,
        borderWidth: 1,
        borderColor: '#2B313D',
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
        width: 54,
        height: 54,
        borderRadius: 16,
        backgroundColor: '#2C3440',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 14,
    },

    vehicleIcon: {
        fontSize: 28,
    },

    vehicleInfo: {
        flex: 1,
    },

    vehicleName: {
        color: '#FFFFFF',
        fontSize: 20,
        fontWeight: 'bold',
    },

    vehicleSubtitle: {
        color: '#9CA3AF',
        fontSize: 13,
        marginTop: 5,
    },

    arrow: {
        color: '#9CA3AF',
        fontSize: 30,
    },

    statusRow: {
        marginTop: 18,
        flexDirection: 'row',
    },

    statusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 7,
        borderRadius: 20,
    },

    statusDot: {
        width: 7,
        height: 7,
        borderRadius: 4,
        marginRight: 7,
    },

    statusText: {
        fontSize: 11,
        fontWeight: 'bold',
        letterSpacing: 1,
    },

    divider: {
        height: 1,
        backgroundColor: '#343A46',
        marginVertical: 20,
    },

    statsContainer: {
        flexDirection: 'row',
    },

    stat: {
        flex: 1,
    },

    statLabel: {
        color: '#9CA3AF',
        fontSize: 10,
        fontWeight: 'bold',
        letterSpacing: 0.6,
        marginBottom: 10,
    },

    statValue: {
        color: '#FFFFFF',
        fontSize: 22,
        fontWeight: 'bold',
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
        backgroundColor: '#141922',
        padding: 14,
        borderRadius: 12,
        marginTop: 22,
    },

    serviceIcon: {
        fontSize: 17,
        marginRight: 10,
    },

    serviceMessage: {
        color: '#D1D5DB',
        fontSize: 13,
        fontWeight: '500',
        flex: 1,
    },

    footer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        marginTop: 20,
    },

    detailsText: {
        color: '#FF7A00',
        fontSize: 11,
        fontWeight: 'bold',
        letterSpacing: 1.2,
    },

    detailsArrow: {
        color: '#FF7A00',
        fontSize: 20,
        marginLeft: 8,
    },
});