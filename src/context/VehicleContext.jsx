import {
    createContext,
    useContext,
    useState,
    useEffect,
    useCallback,
} from 'react';

import {
    View,
    Text,
    Pressable,
    ActivityIndicator,
    StyleSheet,
} from 'react-native';

import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';

export const VehicleContext = createContext(null);

// Convert PostgreSQL data to React Native vehicle object
function mapVehicle(vehicle) {
    return {
        id: vehicle.id,
        brand: vehicle.brand,
        model: vehicle.model,
        year: vehicle.year,
        fuelType: vehicle.fuel_type,
        mileage: vehicle.mileage,
        nextOilChange: vehicle.next_oil_change,
        imageUri: vehicle.image_path,
    };
}

function mapVehicleToDatabase(vehicle) {
    return {
        brand: vehicle.brand,
        model: vehicle.model,
        year: Number(vehicle.year),
        fuel_type: vehicle.fuelType,
        mileage: Number(vehicle.mileage),
        next_oil_change: Number(vehicle.nextOilChange),
        image_path: vehicle.imageUri || null,
    };
}

export function VehicleProvider({ children }) {
    const { user } = useAuth();

    const [vehicles, setVehicles] = useState([]);

    const [isLoading, setIsLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);

    const [loadError, setLoadError] = useState(null);

    const fetchVehicles = useCallback(async (refresh = false) => {
        if (!user?.id) {
            setVehicles([]);
            setIsLoading(false);
            return;
        }

        if (refresh) {
            setIsRefreshing(true);
        } else {
            setIsLoading(true);
        }

        setLoadError(null);

        try {
            const { data, error } = await supabase
                .from('vehicles')
                .select('*')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false });

            if (error) {
                throw error;
            }

            const formattedVehicles = (data || []).map(mapVehicle);

            setVehicles(formattedVehicles);
        } catch (error) {
            console.error('Fetch Vehicles Error:', error);

            setLoadError(
                error.message || 'Unable to load vehicles.'
            );
        } finally {
            setIsLoading(false);
            setIsRefreshing(false);
        }
    }, [user?.id]);

    useEffect(() => {
        fetchVehicles();
    }, [fetchVehicles]);


    async function refreshVehicles() {
        await fetchVehicles(true);
    }

    async function addVehicle(newVehicle) {
        if (!user?.id) {
            throw new Error('You must be logged in.');
        }

        const vehicleData = {
            ...mapVehicleToDatabase(newVehicle),
            user_id: user.id,
        };

        const { data, error } = await supabase
            .from('vehicles')
            .insert(vehicleData)
            .select()
            .single();

        if (error) {
            console.error('Add Vehicle Error:', error);
            throw error;
        }

        const createdVehicle = mapVehicle(data);

        setVehicles(previousVehicles => [
            createdVehicle,
            ...previousVehicles,
        ]);

        return createdVehicle;
    }

    async function updateVehicle(vehicleId, updatedData) {
        if (!user?.id) {
            throw new Error('You must be logged in.');
        }

        const vehicleData = mapVehicleToDatabase(updatedData);

        const { data, error } = await supabase
            .from('vehicles')
            .update(vehicleData)
            .eq('id', vehicleId)
            .eq('user_id', user.id)
            .select()
            .single();

        if (error) {
            console.error('Update Vehicle Error:', error);
            throw error;
        }

        const updatedVehicle = mapVehicle(data);

        setVehicles(previousVehicles =>
            previousVehicles.map(vehicle =>
                vehicle.id === vehicleId
                    ? updatedVehicle
                    : vehicle
            )
        );

        return updatedVehicle;
    }

    async function deleteVehicle(vehicleId) {
        if (!user?.id) {
            throw new Error('You must be logged in.');
        }

        const { data, error } = await supabase
            .from('vehicles')
            .delete()
            .eq('id', vehicleId)
            .eq('user_id', user.id)
            .select('id');

        if (error) {
            console.error('Delete Vehicle Error:', error);
            throw error;
        }

        if (!data?.length) {
            throw new Error('Vehicle not found or access denied.');
        }

        setVehicles(previousVehicles =>
            previousVehicles.filter(
                vehicle => vehicle.id !== vehicleId
            )
        );
    }

    if (isLoading) {
        return (
            <View style={styles.centerContainer}>
                <ActivityIndicator
                    size="large"
                    color="#FF7A00"
                />

                <Text style={styles.loadingText}>
                    Loading your garage...
                </Text>
            </View>
        );
    }

    if (loadError && vehicles.length === 0) {
        return (
            <View style={styles.centerContainer}>
                <Text style={styles.errorTitle}>
                    Unable to load your garage
                </Text>

                <Text style={styles.errorMessage}>
                    {loadError}
                </Text>

                <Pressable
                    style={styles.retryButton}
                    onPress={() => fetchVehicles()}
                >
                    <Text style={styles.retryButtonText}>
                        Try Again
                    </Text>
                </Pressable>
            </View>
        );
    }

    return (
        <VehicleContext.Provider
            value={{
                vehicles,
                isLoading,
                isRefreshing,
                loadError,
                fetchVehicles,
                refreshVehicles,
                addVehicle,
                updateVehicle,
                deleteVehicle,
            }}
        >
            {children}
        </VehicleContext.Provider>
    );
}

export function useVehicles() {
    const context = useContext(VehicleContext);

    if (!context) {
        throw new Error(
            'useVehicles must be used within a VehicleProvider'
        );
    }

    return context;
}

const styles = StyleSheet.create({
    centerContainer: {
        flex: 1,
        backgroundColor: '#0F1117',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 25,
    },

    loadingText: {
        color: '#9CA3AF',
        fontSize: 14,
        marginTop: 18,
    },

    errorTitle: {
        color: '#FFFFFF',
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 12,
    },

    errorMessage: {
        color: '#9CA3AF',
        fontSize: 14,
        textAlign: 'center',
        marginBottom: 25,
    },

    retryButton: {
        backgroundColor: '#FF7A00',
        paddingHorizontal: 28,
        paddingVertical: 14,
        borderRadius: 12,
    },

    retryButtonText: {
        color: '#FFFFFF',
        fontSize: 15,
        fontWeight: 'bold',
    },
});