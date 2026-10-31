import VehicleCard from "./VehicleCard";
import { View, StyleSheet } from "react-native";

export default function VehicleList({ vehicles }) {
    return (
        <View style={styles.container}>
            {vehicles.map(vehicle => (
                <VehicleCard
                    key={vehicle.id}
                    vehicle={vehicle}
                />
            ))}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        gap: 20
    }
})
