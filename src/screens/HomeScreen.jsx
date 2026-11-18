import { useState } from 'react';

import {
    View,
    Text,
    ScrollView,
    Pressable,
    StyleSheet,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import VehicleList from '../components/VehicleList';
import AddVehicleForm from '../components/AddVehicleForm';
import { useVehicles } from '../context/VehicleContext';
import { theme } from '../theme/theme';

export default function HomeScreen({ navigation }) {
    const { vehicles, addVehicle } = useVehicles();

    const [isAddVehicleVisible, setIsAddVehicleVisible] = useState(false);

    const totalVehicles = vehicles.length;

    const vehiclesNeedingAttention = vehicles.filter(vehicle => {
        const remainingKm =
            Number(vehicle.nextOilChange) - Number(vehicle.mileage);

        return remainingKm <= 1000;
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
                    <View style={styles.headerInfo}>
                        <Text style={styles.welcomeText}>
                            YOUR VEHICLE COMPANION
                        </Text>

                        <Text style={styles.title}>
                            Auto
                            <Text style={styles.titleAccent}>
                                Care
                            </Text>
                        </Text>

                        <Text style={styles.subtitle}>
                            Keep your vehicles in perfect shape.
                        </Text>
                    </View>

                    <View style={styles.headerIcon}>
                        <Ionicons
                            name="car-sport"
                            size={32}
                            color="#FF7A00"
                        />
                    </View>
                </View>

                <View style={styles.dashboardHeader}>
                    <Text style={styles.sectionTitle}>
                        Overview
                    </Text>

                    <Text style={styles.sectionSubtitle}>
                        Your garage
                    </Text>
                </View>

                <View style={styles.statsContainer}>

                    <View style={styles.statCard}>
                        <View style={styles.statIconContainer}>
                            <Ionicons
                                name="car-sport-outline"
                                size={25}
                                color="#FF7A00"
                            />
                        </View>

                        <Text style={styles.statNumber}>
                            {totalVehicles}
                        </Text>

                        <Text style={styles.statLabel}>
                            Total Vehicles
                        </Text>

                        <View style={styles.statAccent} />
                    </View>

                    {/* Vehicles Needing Attention */}
                    <View style={styles.statCard}>
                        <View style={styles.statIconContainer}>
                            <Ionicons
                                name="construct-outline"
                                size={25}
                                color={
                                    vehiclesNeedingAttention > 0
                                        ? '#FF7A00'
                                        : '#22C55E'
                                }
                            />
                        </View>

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

                        <View
                            style={[
                                styles.statAccent,
                                vehiclesNeedingAttention === 0 &&
                                    styles.goodAccent,
                            ]}
                        />
                    </View>
                </View>

                {/* Add Vehicle Button */}
                <Pressable
                    style={({ pressed }) => [
                        styles.addButton,
                        pressed && styles.addButtonPressed,
                    ]}
                    onPress={openAddVehicleHandler}
                >
                    <View style={styles.addButtonIconContainer}>
                        <Ionicons
                            name="add"
                            size={27}
                            color="#FFFFFF"
                        />
                    </View>

                    <Text style={styles.addButtonText}>
                        Add New Vehicle
                    </Text>

                    <Ionicons
                        name="arrow-forward"
                        size={22}
                        color="#FFFFFF"
                    />
                </Pressable>

                {/* My Garage Header */}
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
                            <Ionicons
                                name="car-sport-outline"
                                size={50}
                                color="#FF7A00"
                            />
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
                            <Ionicons
                                name="add-circle-outline"
                                size={20}
                                color="#FF7A00"
                            />

                            <Text style={styles.emptyButtonText}>
                                Add Your First Vehicle
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
    // Main Container
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },

    content: {
        paddingHorizontal: 20,
        paddingTop: theme.spacing.lg,
        paddingBottom: 50,
    },

    // Premium Header
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 35,
    },

    headerInfo: {
        flex: 1,
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
        borderRadius: 16,
        backgroundColor: '#1C212B',
        borderWidth: 1,
        borderColor: '#303641',
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 12,
    },

    dashboardHeader: {
        marginBottom: 16,
    },

    sectionTitle: {
        color: '#FFFFFF',
        fontSize: 22,
        fontWeight: 'bold',
        letterSpacing: -0.5,
    },

    sectionSubtitle: {
        color: '#9CA3AF',
        fontSize: 13,
        marginTop: 5,
    },

    // Dashboard Statistics
    statsContainer: {
        flexDirection: 'row',
        gap: 14,
        marginBottom: 26,
    },

    statCard: {
        flex: 1,
        backgroundColor: '#1C212B',
        borderRadius: 20,
        padding: 18,
        borderWidth: 1,
        borderColor: '#303641',
        minHeight: 170,
        overflow: 'hidden',
    },

    statIconContainer: {
        width: 46,
        height: 46,
        borderRadius: 14,
        backgroundColor: '#332519',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 18,
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
        marginTop: 6,
        marginBottom: 16,
    },

    statAccent: {
        width: 45,
        height: 3,
        backgroundColor: '#FF7A00',
        borderRadius: 10,
    },

    goodAccent: {
        backgroundColor: '#22C55E',
    },

    // Add Vehicle Button
    addButton: {
        backgroundColor: '#FF7A00',
        borderRadius: 16,
        padding: 15,
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 35,
    },

    addButtonPressed: {
        opacity: 0.85,
    },

    addButtonIconContainer: {
        width: 42,
        height: 42,
        borderRadius: 12,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 14,
    },

    addButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
        flex: 1,
    },

    // My Garage Header
    garageHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },

    vehicleCountBadge: {
        minWidth: 42,
        height: 42,
        paddingHorizontal: 10,
        backgroundColor: '#1C212B',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#303641',
        alignItems: 'center',
        justifyContent: 'center',
    },

    vehicleCountText: {
        color: '#FF7A00',
        fontSize: 16,
        fontWeight: 'bold',
    },

    // Empty State
    emptyContainer: {
        backgroundColor: '#1C212B',
        borderRadius: 22,
        padding: 28,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#303641',
    },

    emptyIconContainer: {
        width: 85,
        height: 85,
        borderRadius: 25,
        backgroundColor: '#332519',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
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
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },

    emptyButtonText: {
        color: '#FF7A00',
        fontSize: 14,
        fontWeight: 'bold',
    },
});