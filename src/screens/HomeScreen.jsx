import { useState } from 'react';

import {
    View,
    Text,
    ScrollView,
    Pressable,
    StyleSheet,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';

import VehicleList from '../components/VehicleList';
import AddVehicleForm from '../components/AddVehicleForm';
import { useVehicles } from '../context/VehicleContext';

export default function HomeScreen({ navigation }) {
    const { vehicles, addVehicle } = useVehicles();

    const [isAddVehicleVisible, setIsAddVehicleVisible] = useState(false);

    const totalVehicles = vehicles.length;

    const vehiclesNeedingAttention = vehicles.filter(vehicle => {
        const remainingKm =
            Number(vehicle.nextOilChange) - Number(vehicle.mileage);

        return remainingKm <= 2000;
    }).length;

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
            <ScrollView
                contentContainerStyle={styles.content}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.header}>
                    <View>
                        <Text style={styles.welcomeText}>
                            YOUR VEHICLE COMPANION
                        </Text>

                        <Text style={styles.title}>
                            Auto<Text style={styles.titleAccent}>Care</Text>
                        </Text>

                        <Text style={styles.subtitle}>
                            Keep your vehicles in perfect shape.
                        </Text>
                    </View>

                    <View style={styles.headerIcon}>
                        <Text style={styles.headerIconText}>🏎️</Text>
                    </View>
                </View>

                <View style={styles.dashboardHeader}>
                    <Text style={styles.sectionTitle}>
                        Overview
                    </Text>

                    <Text style={styles.sectionSubtitle}>
                        Your garage at a glance
                    </Text>
                </View>

                <View style={styles.statsContainer}>
                    <View style={styles.statCard}>
                        <Text style={styles.statIcon}>🚘</Text>

                        <Text style={styles.statNumber}>
                            {totalVehicles}
                        </Text>

                        <Text style={styles.statLabel}>
                            Total Vehicles
                        </Text>
                    </View>

                    <View style={styles.statCard}>
                        <Text style={styles.statIcon}>🔧</Text>

                        <Text
                            style={[
                                styles.statNumber,
                                vehiclesNeedingAttention > 0 &&
                                    styles.attentionNumber,
                            ]}
                        >
                            {vehiclesNeedingAttention}
                        </Text>

                        <Text style={styles.statLabel}>
                            Need Attention
                        </Text>
                    </View>
                </View>

                <Pressable
                    style={({ pressed }) => [
                        styles.addButton,
                        pressed && styles.addButtonPressed,
                    ]}
                    onPress={openAddVehicleHandler}
                >
                    <Text style={styles.addButtonIcon}>＋</Text>

                    <Text style={styles.addButtonText}>
                        Add New Vehicle
                    </Text>

                    <Text style={styles.addButtonArrow}>→</Text>
                </Pressable>

                <View style={styles.garageHeader}>
                    <View>
                        <Text style={styles.sectionTitle}>
                            My Garage
                        </Text>

                        <Text style={styles.sectionSubtitle}>
                            Manage your vehicles
                        </Text>
                    </View>

                    <View style={styles.vehicleCountBadge}>
                        <Text style={styles.vehicleCountText}>
                            {totalVehicles}
                        </Text>
                    </View>
                </View>

                {vehicles.length > 0 ? (
                    <VehicleList
                        vehicles={vehicles}
                        onSelect={selectVehicleHandler}
                    />
                ) : (
                    <View style={styles.emptyContainer}>
                        <View style={styles.emptyIconContainer}>
                            <Text style={styles.emptyIcon}>🚘</Text>
                        </View>

                        <Text style={styles.emptyTitle}>
                            Your garage is empty
                        </Text>

                        <Text style={styles.emptyDescription}>
                            Add your first vehicle to start tracking
                            maintenance and keep everything under control.
                        </Text>

                        <Pressable
                            onPress={openAddVehicleHandler}
                            style={styles.emptyButton}
                        >
                            <Text style={styles.emptyButtonText}>
                                + Add Your First Vehicle
                            </Text>
                        </Pressable>
                    </View>
                )}
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
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 50,
    },


    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 36,
    },

    welcomeText: {
        color: '#FF7A00',
        fontSize: 10,
        fontWeight: 'bold',
        letterSpacing: 2,
        marginBottom: 10,
    },

    title: {
        color: '#FFFFFF',
        fontSize: 36,
        fontWeight: 'bold',
        letterSpacing: -1,
    },

    titleAccent: {
        color: '#FF7A00',
    },

    subtitle: {
        color: '#9CA3AF',
        fontSize: 13,
        marginTop: 6,
    },

    headerIcon: {
        width: 55,
        height: 55,
        borderRadius: 18,
        backgroundColor: '#1C212B',
        borderWidth: 1,
        borderColor: '#343A46',
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 10,
    },

    headerIconText: {
        fontSize: 28,
    },


    dashboardHeader: {
        marginBottom: 16,
    },

    sectionTitle: {
        color: '#FFFFFF',
        fontSize: 22,
        fontWeight: 'bold',
    },

    sectionSubtitle: {
        color: '#9CA3AF',
        fontSize: 13,
        marginTop: 5,
    },


    statsContainer: {
        flexDirection: 'row',
        gap: 14,
        marginBottom: 26,
    },

    statCard: {
        flex: 1,
        backgroundColor: '#1C212B',
        borderRadius: 20,
        padding: 20,
        borderWidth: 1,
        borderColor: '#2B313D',
    },

    statIcon: {
        fontSize: 24,
        marginBottom: 16,
    },

    statNumber: {
        color: '#FFFFFF',
        fontSize: 32,
        fontWeight: 'bold',
    },

    attentionNumber: {
        color: '#FF7A00',
    },

    statLabel: {
        color: '#9CA3AF',
        fontSize: 12,
        marginTop: 7,
    },


    addButton: {
        backgroundColor: '#FF7A00',
        borderRadius: 16,
        paddingVertical: 18,
        paddingHorizontal: 20,
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 36,
    },

    addButtonPressed: {
        opacity: 0.85,
    },

    addButtonIcon: {
        color: '#FFFFFF',
        fontSize: 26,
        fontWeight: 'bold',
        marginRight: 12,
    },

    addButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
        flex: 1,
    },

    addButtonArrow: {
        color: '#FFFFFF',
        fontSize: 24,
    },

    // Garage Section

    garageHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },

    vehicleCountBadge: {
        backgroundColor: '#2C3440',
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 12,
    },

    vehicleCountText: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: 'bold',
    },

    // Empty State

    emptyContainer: {
        backgroundColor: '#1C212B',
        borderRadius: 22,
        padding: 28,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#2B313D',
    },

    emptyIconContainer: {
        width: 85,
        height: 85,
        borderRadius: 25,
        backgroundColor: '#2C3440',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },

    emptyIcon: {
        fontSize: 40,
    },

    emptyTitle: {
        color: '#FFFFFF',
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 12,
        textAlign: 'center',
    },

    emptyDescription: {
        color: '#9CA3AF',
        fontSize: 14,
        lineHeight: 22,
        textAlign: 'center',
        marginBottom: 24,
    },

    emptyButton: {
        borderWidth: 1,
        borderColor: '#FF7A00',
        borderRadius: 12,
        paddingHorizontal: 20,
        paddingVertical: 14,
    },

    emptyButtonText: {
        color: '#FF7A00',
        fontSize: 14,
        fontWeight: 'bold',
    },
});