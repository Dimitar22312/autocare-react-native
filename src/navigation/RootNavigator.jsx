import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "../screens/HomeScreen";
import VehicleDetailsScreen from "../screens/VehicleDetailsScreen";

const Stack = createNativeStackNavigator();

export default function RootNavigator({ vehicles, onAddVehicle }) {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="Home"
                options={{ headerShown: false }}
            >
                {(props) =>
                    <HomeScreen
                        {...props}
                        vehicles={vehicles}
                        onAddVehicle={onAddVehicle}
                    />
                }
            </Stack.Screen>

            <Stack.Screen
                name="VehicleDetails"
                options={{
                    title: 'Vehicle Details',
                    headerStyle: {
                        backgroundColor: '#0F1117',
                    },
                    headerTintColor: '#FFFFFF'
                }}
            >
                {(props) => (
                    <VehicleDetailsScreen
                        {...props}
                        vehicles={vehicles}
                    />
                )}
            </Stack.Screen>
        </Stack.Navigator>
    )
}