import { createContext, useContext } from 'react';
import { View, ActivityIndicator } from 'react-native';

import usePersistedState from '../hooks/usePersistedState';

export const VehicleContext = createContext(null);

export function VehicleProvider({ children }) {
    const [vehicles, setVehicles, isLoaded] = 
        usePersistedState('vehicles', []);

    function addVehicle(newVehicle) {
        setVehicles(previousVehicles => [
            ...previousVehicles,
            {
                ...newVehicle,
                id: Date.now(),
            },
        ]);
    }

    function updateVehicle(vehicleId, updatedData) {
    setVehicles(previousVehicles =>
        previousVehicles.map(vehicle =>
            vehicle.id === vehicleId
                ? { ...vehicle, ...updatedData }
                : vehicle
        )
    );
}

function deleteVehicle(vehicleId) {
    setVehicles(previousVehicles =>
        previousVehicles.filter(vehicle => vehicle.id !== vehicleId)
    );
}

    if (!isLoaded) {
        return (
            <View 
                style={{
                    flex: 1,
                    backgroundColor: '#0F1117',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                <ActivityIndicator
                    size="large"
                    color="#FF7A00"
                />
            </View>
        );
    }

    return (
        <VehicleContext.Provider 
            value={{ vehicles, addVehicle, updateVehicle, deleteVehicle }}>

            {children}

        </VehicleContext.Provider>
    );
}

export function useVehicles() {
    const context = useContext(VehicleContext);

    if (!context) {
        throw new Error('useVehicles must be used within a VehicleProvider');
    }

    return context;
}