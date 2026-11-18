import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'react-native';

import RootNavigator from './navigation/RootNavigator';
import { AuthProvider } from './context/AuthContext';

export default function App() {
    return (
        <AuthProvider>
            <StatusBar
                barStyle="light-content"
                backgroundColor="#0F1117"
            />

            <NavigationContainer>
                <RootNavigator />
            </NavigationContainer>
        </AuthProvider>
    );
}