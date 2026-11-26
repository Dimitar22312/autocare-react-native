import {
    View,
    Text,
    Pressable,
    StyleSheet,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';

export default function VehicleSelector({
    vehicles,
    selectedVehicleId,
    onSelectVehicle,
    disabled = false,
}) {
    return (
        <View style={styles.container}>
            {vehicles.map((vehicle) => {
                const isSelected =
                    vehicle.id === selectedVehicleId;

                return (
                    <Pressable
                        key={vehicle.id}
                        style={[
                            styles.vehicleChip,
                            isSelected &&
                                styles.selectedVehicleChip,
                            disabled &&
                                styles.disabledChip,
                        ]}
                        onPress={() =>
                            onSelectVehicle(vehicle.id)
                        }
                        disabled={disabled}
                    >
                        <Ionicons
                            name="car-sport"
                            size={19}
                            color={
                                isSelected
                                    ? '#FF7A00'
                                    : '#9CA3AF'
                            }
                        />

                        <Text
                            style={[
                                styles.vehicleChipText,
                                isSelected &&
                                    styles.selectedVehicleText,
                            ]}
                        >
                            {vehicle.brand} {vehicle.model}
                        </Text>
                    </Pressable>
                );
            })}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
        marginBottom: 32,
    },

    vehicleChip: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        paddingHorizontal: 14,
        paddingVertical: 12,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#303641',
        backgroundColor: '#1C212B',
    },

    selectedVehicleChip: {
        borderColor: '#FF7A00',
        backgroundColor: '#332519',
    },

    vehicleChipText: {
        color: '#9CA3AF',
        fontSize: 13,
        fontWeight: 'bold',
    },

    selectedVehicleText: {
        color: '#FF7A00',
    },

    disabledChip: {
        opacity: 0.6,
    },
});