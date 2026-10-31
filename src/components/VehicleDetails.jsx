import { Pressable, View, Text, StyleSheet } from "react-native";

export default function VehicleDetails({ vehicle, onBack }) {
    return (
        <View style={styles.container}>
            <Pressable onPress={onBack} style={styles.backButton}>
                <Text style={styles.backText}>← Back</Text>
            </Pressable>

            <Text style={styles.icon}>🚗</Text>

            <Text style={styles.title}>
                {vehicle.brand} {vehicle.model}
            </Text>

            <Text style={styles.subtitle}>
                Vehicle Details
            </Text>

            <View style={styles.detailsCard}>
                <Text style={styles.label}>Brand</Text>
                <Text style={styles.value}>{vehicle.brand}</Text>

                <Text style={styles.label}>Model</Text>
                <Text style={styles.value}>{vehicle.model}</Text>

                <Text style={styles.label}>Year</Text>
                <Text style={styles.value}>{vehicle.year}</Text>

                <Text style={styles.label}>Fuel Type</Text>
                <Text style={styles.value}>{vehicle.fuelType}</Text>

                <Text style={styles.label}>Current Mileage</Text>
                <Text style={styles.value}>
                    {vehicle.mileage.toLocaleString('en-US')} km
                </Text>

                <Text style={styles.label}>Next Oil Change</Text>
                <Text style={styles.value}>
                    {vehicle.nextOilChange.toLocaleString('en-US')} km
                </Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 20,
    },
    backButton: {
        marginBottom: 30,
    },
    backText: {
        color: '#FF7A00',
        fontSize: 18,
        fontWeight: 'bold',
    },
    icon: {
        fontSize: 60,
        textAlign: 'center',
    },
    title: {
        color: '#FFFFFF',
        fontSize: 30,
        fontWeight: 'bold',
        textAlign: 'center',
        marginTop: 15,
    },
    subtitle: {
        color: '#9CA3AF',
        fontSize: 16,
        textAlign: 'center',
        marginTop: 8,
    },
    detailsCard: {
        backgroundColor: '#1C212B',
        borderRadius: 20,
        padding: 24,
        marginTop: 30,
    },
    label: {
        color: '#9CA3AF',
        fontSize: 14,
        marginTop: 15,
    },
    value: {
        color: '#FFFFFF',
        fontSize: 20,
        fontWeight: 'bold',
        marginTop: 5,
    },
});