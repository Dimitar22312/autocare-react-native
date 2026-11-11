import { useState } from 'react';
import { Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import VehicleList from '../components/VehicleList';
import AddVehicleForm from '../components/AddVehicleForm';
import { useVehicles } from '../context/VehicleContext';

export default function HomeScreen({ navigation }) {
    const { vehicles, addVehicle } = useVehicles();

    const [isAddVehicleVisible, setIsAddVehicleVisible] = useState(false);

    function selectVehicleHandler(vehicle) {
        navigation.navigate('VehicleDetails', {
            vehicleId: vehicle.id,
        });
    }

    function openAddVehicleHandler() {
        setIsAddVehicleVisible(true);
    }

    function closeAddVehicleHandler() {
        setIsAddVehicleVisible(false);
    }

    function addVehicleHandler(newVehicle) {
        addVehicle(newVehicle);
        closeAddVehicleHandler();
    }

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.content}>
                <Text style={styles.title}>AutoCare</Text>

                <Text style={styles.subtitle}>
                    Vehicle Maintenance Tracker
                </Text>

                <Pressable
                    style={styles.addButton}
                    onPress={openAddVehicleHandler}
                >
                    <Text style={styles.addButtonText}>
                        + Add Vehicle
                    </Text>
                </Pressable>

                <VehicleList
                    vehicles={vehicles}
                    onSelect={selectVehicleHandler}
                />
            </ScrollView>

            <AddVehicleForm
                visible={isAddVehicleVisible}
                onClose={closeAddVehicleHandler}
                onAddVehicle={addVehicleHandler}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0F1117',
    },
    content: {
        padding: 20,
        paddingBottom: 40,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#FFFFFF',
    },
    subtitle: {
        fontSize: 16,
        color: '#9CA3AF',
        marginBottom: 25,
    },
    addButton: {
        backgroundColor: '#FF7A00',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginBottom: 25,
    },
    addButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
});