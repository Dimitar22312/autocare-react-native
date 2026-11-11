import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from '../screens/HomeScreen';
import VehicleDetailsScreen from '../screens/VehicleDetailsScreen';

const Stack = createNativeStackNavigator();

export default function RootNavigator() {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="Home"
                component={HomeScreen}
                options={{ headerShown: false }}
            />

            <Stack.Screen
                name="VehicleDetails"
                component={VehicleDetailsScreen}
                options={{
                    title: 'Vehicle Details',
                    headerStyle: {
                        backgroundColor: '#0F1117',
                    },
                    headerTintColor: '#FFFFFF',
                }}
            />
        </Stack.Navigator>
    );
}