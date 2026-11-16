import {
    View,
    Text,
    Image,
    Pressable,
    ScrollView,
    StyleSheet,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';

import { theme } from '../theme/theme';

export default function VehicleDetails({ vehicle, onEdit, onDelete }) {
    const mileage = Number(vehicle.mileage);
    const nextOilChange = Number(vehicle.nextOilChange);

    const remainingKm = nextOilChange - mileage;
    const isOilChangeDue = remainingKm <= 0;

    // Vehicle Maintenance Status
    const status = isOilChangeDue
        ? 'OVERDUE'
        : remainingKm <= 1000
            ? 'DUE SOON'
            : 'GOOD';

    // Dynamic Status Colors
    const statusColor = status === 'GOOD'
        ? '#22C55E'
        : status === 'DUE SOON'
            ? '#FF7A00'
            : '#EF4444';

    const statusBackground = status === 'GOOD'
        ? '#15382A'
        : status === 'DUE SOON'
            ? '#2D2418'
            : '#3B1D24';

    // Dynamic Service Message
    const serviceMessage = isOilChangeDue
        ? `${Math.abs(remainingKm).toLocaleString('en-US')} km overdue`
        : `${remainingKm.toLocaleString('en-US')} km remaining`;

    return (
        <ScrollView
            style={styles.container}
            contentContainerStyle={styles.content}
            showsVerticalScrollIndicator={false}
        >
            {/* Premium Vehicle Header */}
            <View style={styles.vehicleHeader}>

                {/* Vehicle Hero Image */}
                <View style={styles.heroContainer}>
                    {vehicle.imageUri ? (
                        <Image
                            source={{ uri: vehicle.imageUri }}
                            style={styles.heroImage}
                            resizeMode="cover"
                        />
                    ) : (
                        <Text style={styles.heroPlaceholder}>
                            🚘
                        </Text>
                    )}
                </View>

                {/* Vehicle Name */}
                <Text style={styles.title}>
                    {vehicle.brand} {vehicle.model}
                </Text>

                {/* Vehicle Subtitle */}
                <Text style={styles.subtitle}>
                    {vehicle.year} • {vehicle.fuelType}
                </Text>

                {/* Premium Status Badge */}
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
                            styles.statusBadgeText,
                            { color: statusColor },
                        ]}
                    >
                        ● {status}
                    </Text>
                </View>
            </View>

            {/* Maintenance Overview */}
            <Text style={styles.sectionTitle}>
                Maintenance Overview
            </Text>

            {/* Premium Mileage Cards */}
            <View style={styles.maintenanceContainer}>

                {/* Current Mileage Card */}
                <View style={styles.maintenanceCard}>

                    <View style={styles.cardIconContainer}>
                        <Ionicons
                            name="speedometer-outline"
                            size={24}
                            color="#FF7A00"
                        />
                    </View>

                    <Text style={styles.cardLabel}>
                        CURRENT MILEAGE
                    </Text>

                    <View style={styles.cardValueContainer}>
                        <Text
                            style={styles.cardValue}
                            numberOfLines={1}
                            adjustsFontSizeToFit
                        >
                            {mileage.toLocaleString('en-US')}
                        </Text>

                        <Text style={styles.cardUnit}>
                            km
                        </Text>
                    </View>

                    <View style={styles.cardAccent} />
                </View>

                {/* Next Oil Change Card */}
                <View style={styles.maintenanceCard}>

                    <View style={styles.cardIconContainer}>
                        <Ionicons
                            name="water-outline"
                            size={24}
                            color="#FF7A00"
                        />
                    </View>

                    <Text style={styles.cardLabel}>
                        NEXT OIL CHANGE
                    </Text>

                    <View style={styles.cardValueContainer}>
                        <Text
                            style={styles.cardValue}
                            numberOfLines={1}
                            adjustsFontSizeToFit
                        >
                            {nextOilChange.toLocaleString('en-US')}
                        </Text>

                        <Text style={styles.cardUnit}>
                            km
                        </Text>
                    </View>

                    <View style={styles.cardAccent} />
                </View>
            </View>

            {/* Premium Service Reminder */}
            <View style={styles.serviceCard}>

                {/* Service Header */}
                <View style={styles.serviceHeader}>

                    <View style={styles.serviceIconContainer}>
                        <Ionicons
                            name="construct-outline"
                            size={25}
                            color="#FF7A00"
                        />
                    </View>

                    <View style={styles.serviceHeaderText}>
                        <Text style={styles.serviceLabel}>
                            NEXT SERVICE
                        </Text>

                        <Text style={styles.serviceTitle}>
                            Oil Change
                        </Text>
                    </View>

                    <Ionicons
                        name="notifications-outline"
                        size={22}
                        color="#9CA3AF"
                    />
                </View>

                {/* Service Divider */}
                <View style={styles.serviceDivider} />

                {/* Service Status */}
                <View style={styles.serviceStatusRow}>

                    <View style={styles.serviceStatusInfo}>
                        <Ionicons
                            name={
                                isOilChangeDue
                                    ? 'alert-circle-outline'
                                    : 'checkmark-circle-outline'
                            }
                            size={20}
                            color={statusColor}
                        />

                        <Text
                            style={[
                                styles.serviceStatusText,
                                { color: statusColor },
                            ]}
                        >
                            {status}
                        </Text>
                    </View>

                    <Text style={styles.serviceRemaining}>
                        {serviceMessage}
                    </Text>
                </View>

                {/* Service Mileage Information */}
                <View style={styles.serviceFooter}>

                    <Text style={styles.serviceFooterLabel}>
                        Scheduled at
                    </Text>

                    <Text style={styles.serviceFooterValue}>
                        {nextOilChange.toLocaleString('en-US')} km
                    </Text>
                </View>
            </View>

            {/* Premium Vehicle Specifications */}
            <Text style={styles.sectionTitle}>
                Vehicle Specifications
            </Text>

            <View style={styles.specificationsCard}>

                {/* Brand */}
                <View style={styles.specificationRow}>

                    <View style={styles.specificationIconContainer}>
                        <Ionicons
                            name="car-sport-outline"
                            size={22}
                            color="#FF7A00"
                        />
                    </View>

                    <View style={styles.specificationContent}>
                        <Text style={styles.specificationLabel}>
                            BRAND
                        </Text>

                        <Text style={styles.specificationValue}>
                            {vehicle.brand}
                        </Text>
                    </View>
                </View>

                <View style={styles.specificationDivider} />

                {/* Model */}
                <View style={styles.specificationRow}>

                    <View style={styles.specificationIconContainer}>
                        <Ionicons
                            name="pricetag-outline"
                            size={22}
                            color="#FF7A00"
                        />
                    </View>

                    <View style={styles.specificationContent}>
                        <Text style={styles.specificationLabel}>
                            MODEL
                        </Text>

                        <Text style={styles.specificationValue}>
                            {vehicle.model}
                        </Text>
                    </View>
                </View>

                <View style={styles.specificationDivider} />

                {/* Year */}
                <View style={styles.specificationRow}>

                    <View style={styles.specificationIconContainer}>
                        <Ionicons
                            name="calendar-outline"
                            size={22}
                            color="#FF7A00"
                        />
                    </View>

                    <View style={styles.specificationContent}>
                        <Text style={styles.specificationLabel}>
                            YEAR
                        </Text>

                        <Text style={styles.specificationValue}>
                            {vehicle.year}
                        </Text>
                    </View>
                </View>

                <View style={styles.specificationDivider} />

                {/* Fuel Type */}
                <View style={styles.specificationRow}>

                    <View style={styles.specificationIconContainer}>
                        <Ionicons
                            name="flash-outline"
                            size={22}
                            color="#FF7A00"
                        />
                    </View>

                    <View style={styles.specificationContent}>
                        <Text style={styles.specificationLabel}>
                            FUEL TYPE
                        </Text>

                        <Text style={styles.specificationValue}>
                            {vehicle.fuelType}
                        </Text>
                    </View>
                </View>

            </View>

            {/* Edit Vehicle Button */}
            <Pressable
                style={styles.editButton}
                onPress={onEdit}
            >
                <Ionicons
                    name="create-outline"
                    size={21}
                    color="#FFFFFF"
                />

                <Text style={styles.editButtonText}>
                    Edit Vehicle
                </Text>
            </Pressable>

            {/* Delete Vehicle Button */}
            <Pressable
                style={styles.deleteButton}
                onPress={onDelete}
            >
                <Ionicons
                    name="trash-outline"
                    size={21}
                    color="#EF4444"
                />

                <Text style={styles.deleteButtonText}>
                    Delete Vehicle
                </Text>
            </Pressable>

        </ScrollView>
    );
}

const styles = StyleSheet.create({

    // Main Container
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },

    content: {
        padding: 20,
        paddingBottom: 50,
    },

    // Premium Vehicle Header
    vehicleHeader: {
        alignItems: 'center',
        marginBottom: 30,
    },

    // Premium Hero Image
    heroContainer: {
        width: '100%',
        height: 230,
        backgroundColor: theme.colors.surface,
        borderRadius: theme.borderRadius.xl,
        borderWidth: 1,
        borderColor: theme.colors.border,
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
        marginBottom: theme.spacing.lg,
    },

    heroImage: {
        width: '100%',
        height: '100%',
    },

    heroPlaceholder: {
        fontSize: 90,
    },

    // Vehicle Identity
    title: {
        color: theme.colors.text,
        fontSize: 28,
        fontWeight: 'bold',
        textAlign: 'center',
    },

    subtitle: {
        color: theme.colors.textSecondary,
        fontSize: 15,
        marginTop: 8,
    },

    // Premium Status Badge
    statusBadge: {
        borderRadius: 20,
        paddingHorizontal: 20,
        paddingVertical: 10,
        marginTop: 18,
        borderWidth: 1,
    },

    statusBadgeText: {
        fontSize: 12,
        fontWeight: 'bold',
        letterSpacing: 2,
    },

    // Section Titles
    sectionTitle: {
        color: '#FFFFFF',
        fontSize: 19,
        fontWeight: 'bold',
        marginBottom: 15,
    },

    // Premium Mileage Cards
    maintenanceContainer: {
        flexDirection: 'row',
        gap: 12,
    },

    maintenanceCard: {
        flex: 1,
        backgroundColor: '#1C212B',
        borderRadius: 20,
        padding: 16,
        borderWidth: 1,
        borderColor: '#303641',
        minHeight: 175,
        justifyContent: 'space-between',
        overflow: 'hidden',
    },

    cardIconContainer: {
        width: 42,
        height: 42,
        borderRadius: 12,
        backgroundColor: '#332519',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 14,
    },

    cardLabel: {
        color: '#9CA3AF',
        fontSize: 10,
        fontWeight: '600',
        letterSpacing: 1,
        marginBottom: 10,
    },

    cardValueContainer: {
        flexDirection: 'row',
        alignItems: 'baseline',
        gap: 5,
        marginBottom: 12,
    },

    cardValue: {
        color: '#FFFFFF',
        fontSize: 23,
        fontWeight: 'bold',
        flexShrink: 1,
    },

    cardUnit: {
        color: '#FF7A00',
        fontSize: 12,
        fontWeight: '600',
    },

    cardAccent: {
        height: 3,
        width: 45,
        backgroundColor: '#FF7A00',
        borderRadius: 10,
    },

    // Premium Service Reminder
    serviceCard: {
        backgroundColor: '#1C212B',
        borderRadius: 20,
        padding: 20,
        borderWidth: 1,
        borderColor: '#303641',
        marginTop: 18,
        marginBottom: 30,
    },

    serviceHeader: {
        flexDirection: 'row',
        alignItems: 'center',
    },

    serviceIconContainer: {
        width: 50,
        height: 50,
        borderRadius: 15,
        backgroundColor: '#332519',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 14,
    },

    serviceHeaderText: {
        flex: 1,
    },

    serviceLabel: {
        color: '#FF7A00',
        fontSize: 10,
        fontWeight: 'bold',
        letterSpacing: 2,
        marginBottom: 5,
    },

    serviceTitle: {
        color: '#FFFFFF',
        fontSize: 19,
        fontWeight: 'bold',
    },

    serviceDivider: {
        height: 1,
        backgroundColor: '#303641',
        marginVertical: 20,
    },

    serviceStatusRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 10,
    },

    serviceStatusInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 7,
    },

    serviceStatusText: {
        fontSize: 12,
        fontWeight: 'bold',
        letterSpacing: 1,
    },

    serviceRemaining: {
        color: '#D1D5DB',
        fontSize: 13,
        fontWeight: '600',
    },

    serviceFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 22,
        paddingTop: 16,
        borderTopWidth: 1,
        borderTopColor: '#303641',
    },

    serviceFooterLabel: {
        color: '#9CA3AF',
        fontSize: 13,
    },

    serviceFooterValue: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: 'bold',
    },

    // Premium Vehicle Specifications
    specificationsCard: {
        backgroundColor: '#1C212B',
        borderRadius: 20,
        paddingHorizontal: 18,
        paddingVertical: 8,
        borderWidth: 1,
        borderColor: '#303641',
    },

    specificationRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 16,
    },

    specificationIconContainer: {
        width: 46,
        height: 46,
        borderRadius: 14,
        backgroundColor: '#332519',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 14,
    },

    specificationContent: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 10,
    },

    specificationLabel: {
        color: '#9CA3AF',
        fontSize: 11,
        fontWeight: '600',
        letterSpacing: 1,
        flexShrink: 1,
    },

    specificationValue: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'right',
        flexShrink: 1,
    },

    specificationDivider: {
        height: 1,
        backgroundColor: '#303641',
        marginLeft: 60,
    },

    // Edit Vehicle Button
    editButton: {
        backgroundColor: '#FF7A00',
        padding: 16,
        borderRadius: 12,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 10,
        marginTop: 25,
    },

    editButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
    },

    // Delete Vehicle Button
    deleteButton: {
        backgroundColor: '#2D171B',
        borderWidth: 1,
        borderColor: '#EF4444',
        padding: 16,
        borderRadius: 12,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 10,
        marginTop: 12,
    },

    deleteButtonText: {
        color: '#EF4444',
        fontSize: 16,
        fontWeight: 'bold',
    },
});