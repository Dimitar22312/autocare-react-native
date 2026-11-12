import { useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';

import VehicleDetails from '../components/VehicleDetails';
import AddVehicleForm from '../components/AddVehicleForm';
import { useVehicles } from '../context/VehicleContext';

export default function VehicleDetailsScreen({ route, navigation }) {
    const { vehicles, updateVehicle, deleteVehicle } = useVehicles();

    const [isEditVisible, setIsEditVisible] = useState(false);

    const { vehicleId } = route.params;

    const vehicle = vehicles.find(
        vehicle => vehicle.id === vehicleId
    );

    function openEditHandler() {
        setIsEditVisible(true);
    }

    function closeEditHandler() {
        setIsEditVisible(false);
    }

    function updateVehicleHandler(vehicleId, updatedData) {
        updateVehicle(vehicleId, updatedData);
        closeEditHandler();
    }

    function deleteVehicleHandler() {
        Alert.alert(
            'Delete Vehicle',
            `Are you sure you want to delete ${vehicle.brand} ${vehicle.model}?`,
            [
                {
                    text: 'Cancel',
                    style: 'cancel',
                },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: () => {
                        deleteVehicle(vehicle.id);
                        navigation.goBack();
                    },
                },
            ]
        );
    }

    if (!vehicle) {
        return (
            <View style={styles.container}>
                <Text style={styles.errorText}>
                    Vehicle not found!
                </Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <VehicleDetails
                vehicle={vehicle}
                onEdit={openEditHandler}
                onDelete={deleteVehicleHandler}
            />

            <AddVehicleForm
                visible={isEditVisible}
                vehicleToEdit={vehicle}
                onUpdateVehicle={updateVehicleHandler}
                onClose={closeEditHandler}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0F1117',
    },
    errorText: {
        fontSize: 18,
        color: '#FF7A00',
        padding: 20,
    },
});