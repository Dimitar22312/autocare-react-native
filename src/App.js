import { NavigationContainer } from '@react-navigation/native';

import RootNavigator from './navigation/RootNavigator';
import { VehicleProvider } from './context/VehicleContext';

export default function App() {
    return (
        <VehicleProvider>
            <NavigationContainer>
                <RootNavigator />
            </NavigationContainer>
        </VehicleProvider>
    );
}