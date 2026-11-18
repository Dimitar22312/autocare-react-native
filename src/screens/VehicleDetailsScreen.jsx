import { useState } from 'react';

import {
    View,
    Text,
    StyleSheet,
    Alert,
    ActivityIndicator,
} from 'react-native';

import VehicleDetails from '../components/VehicleDetails';
import AddVehicleForm from '../components/AddVehicleForm';

import { useVehicles } from '../context/VehicleContext';

export default function VehicleDetailsScreen({ route, navigation }) {
    const {
        vehicles,
        updateVehicle,
        deleteVehicle,
    } = useVehicles();

    const [isEditVisible, setIsEditVisible] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

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

    async function updateVehicleHandler(vehicleId, updatedData) {
        await updateVehicle(vehicleId, updatedData);

        closeEditHandler();
    }

    function deleteVehicleHandler() {
        if (!vehicle || isDeleting) {
            return;
        }

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
                    onPress: confirmDeleteHandler,
                },
            ]
        );
    }

    async function confirmDeleteHandler() {
        if (!vehicle || isDeleting) {
            return;
        }

        setIsDeleting(true);

        try {
            console.log('Deleting vehicle:', vehicle.id);

            await deleteVehicle(vehicle.id);

            console.log('Vehicle deleted successfully');

            navigation.goBack();
        } catch (error) {
            console.error('Delete Vehicle Error:', error);

            Alert.alert(
                'Delete Error',
                error.message || 'Unable to delete vehicle.'
            );
        } finally {
            setIsDeleting(false);
        }
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

            {isDeleting && (
                <View style={styles.loadingOverlay}>
                    <ActivityIndicator
                        size="large"
                        color="#FF7A00"
                    />

                    <Text style={styles.loadingText}>
                        Deleting vehicle...
                    </Text>
                </View>
            )}
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

    loadingOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(15, 17, 23, 0.9)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 10,
    },

    loadingText: {
        color: '#FFFFFF',
        fontSize: 14,
        marginTop: 15,
    },
});