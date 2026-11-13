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
import { theme } from '../theme/theme';

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
                        <View style={styles.statIconContainer}>
                            <Text style={styles.statIcon}>🚘</Text>
                        </View>

                        <Text style={styles.statNumber}>
                            {totalVehicles}
                        </Text>

                        <Text style={styles.statLabel}>
                            Total Vehicles
                        </Text>
                    </View>

                    <View style={styles.statCard}>
                        <View style={styles.statIconContainer}>
                            <Text style={styles.statIcon}>🔧</Text>
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
                    </View>
                </View>

                <Pressable
                    style={({ pressed }) => [
                        styles.addButton,
                        pressed && styles.addButtonPressed,
                    ]}
                    onPress={openAddVehicleHandler}
                >
                    <View style={styles.addButtonIconContainer}>
                        <Text style={styles.addButtonIcon}>＋</Text>
                    </View>

                    <Text style={styles.addButtonText}>
                        Add New Vehicle
                    </Text>

                    <View style={styles.addButtonArrowContainer}>
                        <Text style={styles.addButtonArrow}>→</Text>
                    </View>
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
        backgroundColor: theme.colors.background,
    },

    content: {
        paddingHorizontal: 20,
        paddingTop: theme.spacing.lg,
        paddingBottom: 50,
    },


    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: theme.spacing.xl,
    },

    welcomeText: {
        color: theme.colors.primary,
        fontSize: 10,
        fontWeight: 'bold',
        letterSpacing: 2,
        marginBottom: 10,
    },

    title: {
        color: theme.colors.text,
        fontSize: 36,
        fontWeight: 'bold',
        letterSpacing: -1,
    },

    titleAccent: {
        color: theme.colors.primary,
    },

    subtitle: {
        color: theme.colors.textSecondary,
        fontSize: 13,
        marginTop: 6,
    },

    headerIcon: {
        width: 55,
        height: 55,
        borderRadius: theme.borderRadius.lg,
        backgroundColor: theme.colors.surface,
        borderWidth: 1,
        borderColor: theme.colors.border,
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: theme.spacing.sm,
    },

    headerIconText: {
        fontSize: 30,
    },


    dashboardHeader: {
        marginBottom: 16,
    },

    sectionTitle: {
        color: theme.colors.text,
        fontSize: 22,
        fontWeight: 'bold',
        letterSpacing: -0.5,
    },

    sectionSubtitle: {
        color: theme.colors.textSecondary,
        fontSize: 13,
        marginTop: theme.spacing.xs,
    },


    statsContainer: {
        flexDirection: 'row',
        gap: 14,
        marginBottom: 26,
    },

    statCard: {
        flex: 1,
        backgroundColor: theme.colors.surface,
        borderRadius: theme.borderRadius.lg,
        padding: theme.spacing.md,
        borderWidth: 1,
        borderColor: theme.colors.border,
    },

    statIcon: {
        fontSize: 24,
    },

    statNumber: {
        color: theme.colors.text,
        fontSize: 32,
        fontWeight: 'bold',
    },

    attentionNumber: {
        color: theme.colors.primary,
    },

    statLabel: {
        color: theme.colors.textSecondary,
        fontSize: 12,
        marginTop: theme.spacing.sm,
    },


    addButton: {
        backgroundColor: theme.colors.primary,
        borderRadius: theme.borderRadius.lg,
        paddingVertical: theme.spacing.md,
        paddingHorizontal: theme.spacing.md,
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: theme.spacing.xl,
    },

    addButtonIconContainer: {
        width: 40,
        height: 40,
        borderRadius: theme.borderRadius.md,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: theme.spacing.md,
    },

    addButtonPressed: {
        opacity: 0.85,
    },

    addButtonIcon: {
        color: theme.colors.text,
        fontSize: 26,
        fontWeight: 'bold',
    },

    addButtonText: {
        color: theme.colors.text,
        fontSize: 16,
        fontWeight: 'bold',
        flex: 1,
    },

    addButtonArrow: {
        color: theme.colors.text,
        fontSize: 22,
    },

    addButtonArrowContainer: {
        width: 36,
        height: 36,
        borderRadius: theme.borderRadius.md,
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
        alignItems: 'center',
        justifyContent: 'center',
    },

    // Garage Section

    garageHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: theme.spacing.lg,
    },

    vehicleCountBadge: {
        minWidth: 42,
        height: 42,
        paddingHorizontal: theme.spacing.sm,
        backgroundColor: theme.colors.surface,
        borderRadius: theme.borderRadius.md,
        borderWidth: 1,
        borderColor: theme.colors.border,
        alignItems: 'center',
        justifyContent: 'center',
    },

    vehicleCountText: {
        color: theme.colors.primary,
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
    statIconContainer: {
        width: 48,
        height: 48,
        borderRadius: theme.borderRadius.md,
        backgroundColor: theme.colors.surfaceLight,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: theme.spacing.lg,
    },
});