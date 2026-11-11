import { createContext, useState, useContext } from 'react';

export const VehicleContext = createContext(null);

export function VehicleProvider({ children }) {
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

    function addVehicle(newVehicle) {
        setVehicles(previousVehicles => [
            ...previousVehicles,
            {
                ...newVehicle,
                id: Date.now(),
            },
        ]);
    }

    return (
        <VehicleContext.Provider value={{ vehicles, addVehicle }}>
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