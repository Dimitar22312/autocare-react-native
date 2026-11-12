import {
    View,
    Text,
    Pressable,
    ScrollView,
    StyleSheet,
} from 'react-native';

export default function VehicleDetails({ vehicle, onEdit, onDelete }) {
    const remainingKm = vehicle.nextOilChange - vehicle.mileage;
    const isOilChangeDue = remainingKm <= 0;

    return (
        <ScrollView
            style={styles.container}
            contentContainerStyle={styles.content}
            showsVerticalScrollIndicator={false}
        >
            {/* Vehicle Header */}
            <View style={styles.vehicleHeader}>
                <View style={styles.iconContainer}>
                    <Text style={styles.icon}>🚗</Text>
                </View>

                <Text style={styles.title}>
                    {vehicle.brand} {vehicle.model}
                </Text>

                <Text style={styles.subtitle}>
                    {vehicle.year} • {vehicle.fuelType}
                </Text>
            </View>

            {/* Maintenance Section */}
            <Text style={styles.sectionTitle}>
                Maintenance Overview
            </Text>

            <View style={styles.maintenanceContainer}>
                <View style={styles.maintenanceCard}>
                    <Text style={styles.cardLabel}>
                        Current Mileage
                    </Text>

                    <Text style={styles.cardValue}>
                        {vehicle.mileage.toLocaleString('en-US')}
                    </Text>

                    <Text style={styles.cardUnit}>km</Text>
                </View>

                <View style={styles.maintenanceCard}>
                    <Text style={styles.cardLabel}>
                        Next Oil Change
                    </Text>

                    <Text style={styles.cardValue}>
                        {vehicle.nextOilChange.toLocaleString('en-US')}
                    </Text>

                    <Text style={styles.cardUnit}>km</Text>
                </View>
            </View>

            {/* Maintenance Status */}
            <View style={styles.statusCard}>
                <Text style={styles.statusTitle}>
                    {isOilChangeDue
                        ? '⚠️ Oil Change Due'
                        : '✓ Oil Change Upcoming'}
                </Text>

                <Text style={styles.statusDescription}>
                    {isOilChangeDue
                        ? `${Math.abs(remainingKm).toLocaleString('en-US')} km overdue`
                        : `${remainingKm.toLocaleString('en-US')} km remaining`}
                </Text>
            </View>

            {/* Vehicle Information */}
            <Text style={styles.sectionTitle}>
                Vehicle Information
            </Text>

            <View style={styles.detailsCard}>
                <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Brand</Text>
                    <Text style={styles.detailValue}>
                        {vehicle.brand}
                    </Text>
                </View>

                <View style={styles.divider} />

                <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Model</Text>
                    <Text style={styles.detailValue}>
                        {vehicle.model}
                    </Text>
                </View>

                <View style={styles.divider} />

                <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Year</Text>
                    <Text style={styles.detailValue}>
                        {vehicle.year}
                    </Text>
                </View>

                <View style={styles.divider} />

                <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Fuel Type</Text>
                    <Text style={styles.detailValue}>
                        {vehicle.fuelType}
                    </Text>
                </View>
            </View>

            {/* Edit Button */}
            <Pressable
                style={styles.editButton}
                onPress={onEdit}
            >
                <Text style={styles.editButtonText}>
                    ✏️ Edit Vehicle
                </Text>
            </Pressable>
            <Pressable
                style={styles.deleteButton}
                onPress={onDelete}
            >
                <Text style={styles.deleteButtonText}>
                    🗑️ Delete Vehicle
                </Text>
            </Pressable>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0F1117',
    },
    content: {
        padding: 20,
        paddingBottom: 50,
    },
    vehicleHeader: {
        alignItems: 'center',
        marginBottom: 30,
    },
    iconContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#1C212B',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 15,
    },
    icon: {
        fontSize: 40,
    },
    title: {
        color: '#FFFFFF',
        fontSize: 28,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    subtitle: {
        color: '#9CA3AF',
        fontSize: 15,
        marginTop: 8,
    },
    sectionTitle: {
        color: '#FFFFFF',
        fontSize: 19,
        fontWeight: 'bold',
        marginBottom: 15,
    },
    maintenanceContainer: {
        flexDirection: 'row',
        gap: 12,
    },
    maintenanceCard: {
        flex: 1,
        backgroundColor: '#1C212B',
        padding: 16,
        borderRadius: 15,
    },
    cardLabel: {
        color: '#9CA3AF',
        fontSize: 12,
        marginBottom: 12,
    },
    cardValue: {
        color: '#FFFFFF',
        fontSize: 20,
        fontWeight: 'bold',
    },
    cardUnit: {
        color: '#FF7A00',
        fontSize: 13,
        marginTop: 5,
    },
    statusCard: {
        backgroundColor: '#252018',
        borderRadius: 12,
        padding: 16,
        marginTop: 15,
        marginBottom: 30,
    },
    statusTitle: {
        color: '#FF7A00',
        fontSize: 16,
        fontWeight: 'bold',
    },
    statusDescription: {
        color: '#D1D5DB',
        fontSize: 14,
        marginTop: 6,
    },
    detailsCard: {
        backgroundColor: '#1C212B',
        borderRadius: 15,
        padding: 20,
    },
    detailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
    },
    detailLabel: {
        color: '#9CA3AF',
        fontSize: 15,
    },
    detailValue: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
        flexShrink: 1,
        textAlign: 'right',
        marginLeft: 12,
    },
    divider: {
        height: 1,
        backgroundColor: '#303641',
    },
    editButton: {
        backgroundColor: '#FF7A00',
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 25,
    },
    editButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
    deleteButton: {
    backgroundColor: '#2D171B',
    borderWidth: 1,
    borderColor: '#EF4444',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 12,
},
deleteButtonText: {
    color: '#EF4444',
    fontSize: 16,
    fontWeight: 'bold',
},
});