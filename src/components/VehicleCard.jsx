import { View, Text, StyleSheet, Pressable } from "react-native";

export default function VehicleCard({ vehicle, onPress }) {
    return (
        <Pressable onPress={onPress} style={styles.carCard}>
            <Text style={styles.carIcon}>🚗</Text>

            <Text style={styles.carName}>
                {vehicle.brand} {vehicle.model}
            </Text>

            <Text style={styles.carInfo}>
                {vehicle.year} • {vehicle.fuelType}
            </Text>

            <View style={styles.divider}></View>

            <Text style={styles.label}>Current Mileage</Text>

            <Text style={styles.mileage}>
                {vehicle.mileage.toLocaleString('en-US')} km
            </Text>

            <Text style={styles.label}>Next Oil Change</Text>

            <Text style={styles.serviceText}>
                {vehicle.nextOilChange.toLocaleString('en-US')} km
            </Text>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    carCard: {
        backgroundColor: '#1C212B',
        borderRadius: 20,
        padding: 24,
    },
    carIcon: {
        fontSize: 48,
        textAlign: 'center',
        marginBottom: 12,
    },
    carName: {
        fontSize: 26,
        fontWeight: 'bold',
        color: '#FFFFFF',
        textAlign: 'center',
    },
    carInfo: {
        fontSize: 14,
        color: '#9CA3AF',
        textAlign: 'center',
        marginTop: 6,
    },
    divider: {
        height: 1,
        backgroundColor: '#343A46',
        marginVertical: 24,
    },
    label: {
        fontSize: 14,
        color: '#9CA3AF',
        marginBottom: 8,
    },
    mileage: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#FFFFFF',
        marginBottom: 24,
    },
    serviceText: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#FF7A00',
    },
});