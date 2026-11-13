import { View, StyleSheet } from 'react-native';

import VehicleCard from './VehicleCard';

export default function VehicleList({ vehicles, onSelect }) {
    return (
        <View style={styles.container}>
            {vehicles.map(vehicle => (
                <VehicleCard
                    key={vehicle.id}
                    vehicle={vehicle}
                    onPress={() => onSelect(vehicle)}
                />
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        gap: 16,
    },
});