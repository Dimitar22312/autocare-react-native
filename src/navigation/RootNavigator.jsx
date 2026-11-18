import {
    View,
    ActivityIndicator,
    StyleSheet,
} from 'react-native';

import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import HomeScreen from '../screens/HomeScreen';
import VehicleDetailsScreen from '../screens/VehicleDetailsScreen';

import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import ProfileScreen from '../screens/ProfileScreen';

import { useAuth } from '../context/AuthContext';
import { VehicleProvider } from '../context/VehicleContext';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function GarageTabs() {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: false,

                tabBarActiveTintColor: '#FF7A00',
                tabBarInactiveTintColor: '#9CA3AF',

                tabBarStyle: {
                    backgroundColor: '#1C212B',
                    borderTopWidth: 0,
                    elevation: 0,
                    shadowOpacity: 0,
                    height: 65,
                    paddingTop: 6,
                    paddingBottom: 8,
                },
                sceneStyle: {
                    backgroundColor: '#0F1117',
                },

                tabBarLabelStyle: {
                    fontSize: 11,
                    fontWeight: 'bold',
                },

                tabBarIcon: ({ color, size }) => {
                    const iconName =
                        route.name === 'Home'
                            ? 'car-sport-outline'
                            : 'person-outline';

                    return (
                        <Ionicons
                            name={iconName}
                            size={size}
                            color={color}
                        />
                    );
                },
            })}
        >
            <Tab.Screen
                name="Home"
                component={HomeScreen}
                options={{
                    title: 'My Garage',
                }}
            />

            <Tab.Screen
                name="Profile"
                component={ProfileScreen}
                options={{
                    title: 'Profile',
                }}
            />
        </Tab.Navigator>
    );
}

function AuthNavigator() {
    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false,
                contentStyle: {
                    backgroundColor: '#0F1117',
                },
            }}
        >
            <Stack.Screen
                name="Login"
                component={LoginScreen}
            />

            <Stack.Screen
                name="Register"
                component={RegisterScreen}
            />
        </Stack.Navigator>
    );
}

function MainNavigator() {
    return (
        <VehicleProvider>
            <Stack.Navigator
                screenOptions={{
                    contentStyle: {
                        backgroundColor: '#0F1117',
                    },
                }}
            >
                <Stack.Screen
                    name="GarageTabs"
                    component={GarageTabs}
                    options={{
                        headerShown: false,
                        title: 'My Garage',
                    }}
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
        </VehicleProvider>
    );
}

export default function RootNavigator() {
    const {
        session,
        isInitializing,
    } = useAuth();

    if (isInitializing) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator
                    size="large"
                    color="#FF7A00"
                />
            </View>
        );
    }

    if (session) {
        return (
            <MainNavigator key={session.user.id} />
        );
    }

    return <AuthNavigator />;
}

const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        backgroundColor: '#0F1117',
        justifyContent: 'center',
        alignItems: 'center',
    },
});