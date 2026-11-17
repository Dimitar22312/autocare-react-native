import {
    View,
    Text,
    Image,
    Pressable,
    StyleSheet,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';

import { theme } from '../theme/theme';

export default function VehicleCard({ vehicle, onPress }) {
    const mileage = Number(vehicle.mileage);
    const nextOilChange = Number(vehicle.nextOilChange);

    const remainingKm = nextOilChange - mileage;

    // Vehicle Service Status
    const serviceStatus = remainingKm <= 0
        ? 'OVERDUE'
        : remainingKm <= 1000
            ? 'DUE SOON'
            : 'GOOD';

    // Dynamic Status Colors
    const statusColor = serviceStatus === 'GOOD'
        ? '#22C55E'
        : serviceStatus === 'DUE SOON'
            ? '#FF7A00'
            : '#EF4444';

    const statusBackground = serviceStatus === 'GOOD'
        ? '#15382A'
        : serviceStatus === 'DUE SOON'
            ? '#332519'
            : '#3B1D24';

    // Dynamic Service Message
    const serviceMessage = remainingKm > 0
        ? `${remainingKm.toLocaleString('en-US')} km until service`
        : remainingKm === 0
            ? 'Oil change is due now'
            : `${Math.abs(remainingKm).toLocaleString('en-US')} km overdue`;

    return (
        <Pressable
            onPress={onPress}
            style={({ pressed }) => [
                styles.card,
                pressed && styles.cardPressed,
            ]}
        >
            {/* Premium Vehicle Image */}
            <View style={styles.imageContainer}>
                {vehicle.imageUri ? (
                    <Image
                        source={{ uri: vehicle.imageUri }}
                        style={styles.vehicleImage}
                        resizeMode="cover"
                    />
                ) : (
                    <View style={styles.imagePlaceholder}>
                        <Ionicons
                            name="car-sport-outline"
                            size={75}
                            color="#FF7A00"
                        />

                        <Text style={styles.placeholderText}>
                            AutoCare Premium
                        </Text>
                    </View>
                )}

                {/* Vehicle Status Badge */}
                <View
                    style={[
                        styles.statusBadge,
                        {
                            backgroundColor: statusBackground,
                            borderColor: statusColor,
                        },
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

            {/* Vehicle Content */}
            <View style={styles.cardContent}>

                {/* Vehicle Identity */}
                <View style={styles.vehicleHeader}>
                    <View style={styles.vehicleInfo}>
                        <Text
                            style={styles.vehicleName}
                            numberOfLines={1}
                        >
                            {vehicle.brand} {vehicle.model}
                        </Text>

                        <View style={styles.vehicleSubtitleRow}>
                            <Ionicons
                                name="calendar-outline"
                                size={14}
                                color="#9CA3AF"
                            />

                            <Text style={styles.vehicleSubtitle}>
                                {vehicle.year} • {vehicle.fuelType}
                            </Text>
                        </View>
                    </View>

                    <View style={styles.vehicleArrow}>
                        <Ionicons
                            name="chevron-forward"
                            size={22}
                            color="#FF7A00"
                        />
                    </View>
                </View>

                {/* Divider */}
                <View style={styles.divider} />

                {/* Vehicle Statistics */}
                <View style={styles.statsContainer}>

                    {/* Current Mileage */}
                    <View style={styles.stat}>
                        <View style={styles.statHeader}>
                            <Ionicons
                                name="speedometer-outline"
                                size={17}
                                color="#FF7A00"
                            />

                            <Text style={styles.statLabel}>
                                CURRENT MILEAGE
                            </Text>
                        </View>

                        <Text
                            style={styles.statValue}
                            numberOfLines={1}
                            adjustsFontSizeToFit
                        >
                            {mileage.toLocaleString('en-US')}
                        </Text>

                        <Text style={styles.statUnit}>
                            km
                        </Text>
                    </View>

                    <View style={styles.verticalDivider} />

                    {/* Next Oil Change */}
                    <View style={styles.stat}>
                        <View style={styles.statHeader}>
                            <Ionicons
                                name="water-outline"
                                size={17}
                                color="#FF7A00"
                            />

                            <Text style={styles.statLabel}>
                                NEXT OIL CHANGE
                            </Text>
                        </View>

                        <Text
                            style={styles.statValue}
                            numberOfLines={1}
                            adjustsFontSizeToFit
                        >
                            {nextOilChange.toLocaleString('en-US')}
                        </Text>

                        <Text style={styles.statUnit}>
                            km
                        </Text>
                    </View>

                </View>

                {/* Service Reminder */}
                <View style={styles.serviceContainer}>
                    <View style={styles.serviceIconContainer}>
                        <Ionicons
                            name="construct-outline"
                            size={21}
                            color={statusColor}
                        />
                    </View>

                    <View style={styles.serviceInfo}>
                        <Text style={styles.serviceLabel}>
                            NEXT SERVICE
                        </Text>

                        <Text style={styles.serviceMessage}>
                            {serviceMessage}
                        </Text>
                    </View>

                    <Ionicons
                        name={
                            remainingKm <= 0
                                ? 'alert-circle-outline'
                                : 'checkmark-circle-outline'
                        }
                        size={21}
                        color={statusColor}
                    />
                </View>

                {/* View Details Footer */}
                <View style={styles.footer}>
                    <Text style={styles.detailsText}>
                        VIEW DETAILS
                    </Text>

                    <Ionicons
                        name="arrow-forward"
                        size={20}
                        color="#FF7A00"
                    />
                </View>

            </View>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    // Premium Card
    card: {
        backgroundColor: '#1C212B',
        borderRadius: 22,
        borderWidth: 1,
        borderColor: '#303641',
        overflow: 'hidden',
    },

    cardPressed: {
        opacity: 0.85,
        transform: [{ scale: 0.99 }],
    },

    // Vehicle Image
    imageContainer: {
        width: '100%',
        height: 210,
        backgroundColor: '#141820',
        position: 'relative',
    },

    vehicleImage: {
        width: '100%',
        height: '100%',
    },

    imagePlaceholder: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 12,
    },

    placeholderText: {
        color: '#9CA3AF',
        fontSize: 12,
        fontWeight: '600',
        letterSpacing: 2,
    },

    // Status Badge
    statusBadge: {
        position: 'absolute',
        top: 15,
        right: 15,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 13,
        paddingVertical: 9,
        borderRadius: 20,
        borderWidth: 1,
        gap: 7,
    },

    statusDot: {
        width: 7,
        height: 7,
        borderRadius: 4,
    },

    statusText: {
        fontSize: 10,
        fontWeight: 'bold',
        letterSpacing: 1,
    },

    // Card Content
    cardContent: {
        padding: 20,
    },

    // Vehicle Identity
    vehicleHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },

    vehicleInfo: {
        flex: 1,
    },

    vehicleName: {
        color: '#FFFFFF',
        fontSize: 23,
        fontWeight: 'bold',
        letterSpacing: -0.5,
    },

    vehicleSubtitleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 7,
        marginTop: 8,
    },

    vehicleSubtitle: {
        color: '#9CA3AF',
        fontSize: 13,
    },

    vehicleArrow: {
        width: 38,
        height: 38,
        borderRadius: 12,
        backgroundColor: '#332519',
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 12,
    },

    // Divider
    divider: {
        height: 1,
        backgroundColor: '#303641',
        marginVertical: 20,
    },

    // Vehicle Statistics
    statsContainer: {
        flexDirection: 'row',
        alignItems: 'stretch',
    },

    stat: {
        flex: 1,
        minWidth: 0,
    },

    statHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginBottom: 12,
    },

    statLabel: {
        color: '#9CA3AF',
        fontSize: 9,
        fontWeight: 'bold',
        letterSpacing: 0.5,
        flexShrink: 1,
    },

    statValue: {
        color: '#FFFFFF',
        fontSize: 23,
        fontWeight: 'bold',
    },

    statUnit: {
        color: '#FF7A00',
        fontSize: 12,
        fontWeight: '600',
        marginTop: 4,
    },

    verticalDivider: {
        width: 1,
        backgroundColor: '#303641',
        marginHorizontal: 14,
    },

    // Service Reminder
    serviceContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#141820',
        borderRadius: 14,
        borderWidth: 1,
        borderColor: '#303641',
        padding: 14,
        marginTop: 22,
    },

    serviceIconContainer: {
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: '#252B35',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },

    serviceInfo: {
        flex: 1,
        marginRight: 8,
    },

    serviceLabel: {
        color: '#9CA3AF',
        fontSize: 10,
        fontWeight: 'bold',
        letterSpacing: 1,
        marginBottom: 5,
    },

    serviceMessage: {
        color: '#FFFFFF',
        fontSize: 13,
        fontWeight: '600',
    },

    // Footer
    footer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        gap: 10,
        marginTop: 20,
        paddingTop: 15,
        borderTopWidth: 1,
        borderTopColor: '#303641',
    },

    detailsText: {
        color: '#FF7A00',
        fontSize: 11,
        fontWeight: 'bold',
        letterSpacing: 1.5,
    },
});