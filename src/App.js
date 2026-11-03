import { useState } from 'react';
import {
    Text,
    ScrollView,
    Pressable,
    StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';


import VehicleList from './components/VehicleList';
import VehicleDetails from './components/VehicleDetails';
import AddVehicleForm from './components/AddVehicleForm';

export default function App() {
    const [vehicles, setVehicles] = useState([
        {
            id: 1,
            brand: 'BMW',
            model: '320d',
            year: 2018,
            fuelType: 'Diesel',
            mileage: 145000,
            nextOilChange: 150000,
        },
        {
            id: 2,
            brand: 'Audi',
            model: 'A6',
            year: 2020,
            fuelType: 'Diesel',
            mileage: 92000,
            nextOilChange: 100000,
        },
        {
            id: 3,
            brand: 'Mercedes-Benz',
            model: 'C220',
            year: 2019,
            fuelType: 'Diesel',
            mileage: 118000,
            nextOilChange: 125000,
        },
    ]);

    const [selectedVehicle, setSelectedVehicle] = useState(null);

    const [isAddVehicleVisible, setIsAddVehicleVisible] = useState(false);

    function selectVehicleHandler(vehicle) {
        setSelectedVehicle(vehicle);
    }

    function backHandler() {
        setSelectedVehicle(null);
    }

    function openAddVehicleHandler() {
        setIsAddVehicleVisible(true);
    }

    function closeAddVehicleHandler() {
        setIsAddVehicleVisible(false);
    }

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.content}>
                {selectedVehicle ? (
                    <VehicleDetails
                        vehicle={selectedVehicle}
                        onBack={backHandler}
                    />
                ) : (
                    <>
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
                    </>
                )}
            </ScrollView>

            <AddVehicleForm
                visible={isAddVehicleVisible}
                onClose={closeAddVehicleHandler}
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
        paddingTop: 40,
        paddingBottom: 40,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#FFFFFF',
        marginBottom: 5,
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