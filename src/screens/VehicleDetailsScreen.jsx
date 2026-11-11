import { Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import VehicleDetails from '../components/VehicleDetails';

export default function VehicleDetailsScreen({ route, navigation, vehicles }) {
    const { vehicleId } = route.params;

    const vehicle = vehicles.find(
        vehicle => vehicle.id === vehicleId
    );

    if (!vehicle) {
        return (
            <SafeAreaView style={styles.container}>
                <Text style={styles.errorText}>
                    Vehicle not found!
                </Text>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <VehicleDetails
                vehicle={vehicle}
                onBack={() => navigation.goBack()}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0F1117',
        padding: 20,
    },
    errorText: {
        fontSize: 18,
        color: '#FF7A00',
    },
});