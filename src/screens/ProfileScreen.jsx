import { useState } from 'react';

import {
    View,
    Text,
    Pressable,
    Alert,
    ActivityIndicator,
    StyleSheet,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { useAuth } from '../context/AuthContext';
import { useVehicles } from '../context/VehicleContext';

export default function ProfileScreen() {
    const { user, logout } = useAuth();
    const { vehicles } = useVehicles();

    const [isLoggingOut, setIsLoggingOut] = useState(false);

    const fullName =
        user?.user_metadata?.full_name || 'AutoCare Driver';

    const email = user?.email || '';

    function logoutHandler() {
        Alert.alert(
            'Sign Out',
            'Are you sure you want to sign out?',
            [
                {
                    text: 'Cancel',
                    style: 'cancel',
                },
                {
                    text: 'Sign Out',
                    style: 'destructive',
                    onPress: confirmLogoutHandler,
                },
            ]
        );
    }

    async function confirmLogoutHandler() {
        setIsLoggingOut(true);

        try {
            const { error } = await logout();

            if (error) {
                Alert.alert('Logout Error', error.message);
            }
        } catch (error) {
            console.error('Logout Error:', error);

            Alert.alert(
                'Logout Error',
                'Unable to sign out. Please try again.'
            );
        } finally {
            setIsLoggingOut(false);
        }
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                <Text style={styles.sectionLabel}>
                    YOUR AUTOCARE ACCOUNT
                </Text>

                <Text style={styles.title}>
                    My Profile
                </Text>

                <View style={styles.profileCard}>
                    <View style={styles.avatarContainer}>
                        <Ionicons
                            name="person"
                            size={40}
                            color="#FF7A00"
                        />
                    </View>

                    <Text style={styles.userName}>
                        {fullName}
                    </Text>

                    <Text style={styles.userEmail}>
                        {email}
                    </Text>

                    <View style={styles.accountBadge}>
                        <Ionicons
                            name="checkmark-circle"
                            size={16}
                            color="#22C55E"
                        />

                        <Text style={styles.accountBadgeText}>
                            Active Account
                        </Text>
                    </View>
                </View>

                <View style={styles.statsCard}>
                    <View style={styles.statIcon}>
                        <Ionicons
                            name="car-sport-outline"
                            size={26}
                            color="#FF7A00"
                        />
                    </View>

                    <View style={styles.statInfo}>
                        <Text style={styles.statTitle}>
                            Vehicles in My Garage
                        </Text>

                        <Text style={styles.statSubtitle}>
                            Your registered vehicles
                        </Text>
                    </View>

                    <Text style={styles.statValue}>
                        {vehicles.length}
                    </Text>
                </View>

                <Pressable
                    onPress={logoutHandler}
                    disabled={isLoggingOut}
                    style={({ pressed }) => [
                        styles.logoutButton,
                        pressed && styles.pressed,
                    ]}
                >
                    {isLoggingOut ? (
                        <ActivityIndicator color="#EF4444" />
                    ) : (
                        <>
                            <Ionicons
                                name="log-out-outline"
                                size={23}
                                color="#EF4444"
                            />

                            <Text style={styles.logoutText}>
                                Sign Out
                            </Text>
                        </>
                    )}
                </Pressable>

                <Text style={styles.footer}>
                    AUTOCARE • YOUR VEHICLE COMPANION
                </Text>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0F1117',
    },

    content: {
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: 30,
    },

    sectionLabel: {
        color: '#FF7A00',
        fontSize: 10,
        fontWeight: 'bold',
        letterSpacing: 2,
        marginBottom: 10,
    },

    title: {
        color: '#FFFFFF',
        fontSize: 30,
        fontWeight: 'bold',
        marginBottom: 30,
    },

    profileCard: {
        backgroundColor: '#1C212B',
        borderWidth: 1,
        borderColor: '#303641',
        borderRadius: 24,
        padding: 28,
        alignItems: 'center',
    },

    avatarContainer: {
        width: 90,
        height: 90,
        borderRadius: 45,
        backgroundColor: '#332519',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
    },

    userName: {
        color: '#FFFFFF',
        fontSize: 23,
        fontWeight: 'bold',
    },

    userEmail: {
        color: '#9CA3AF',
        fontSize: 14,
        marginTop: 8,
    },

    accountBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#15382A',
        borderRadius: 20,
        paddingHorizontal: 14,
        paddingVertical: 9,
        gap: 7,
        marginTop: 20,
    },

    accountBadgeText: {
        color: '#22C55E',
        fontSize: 12,
        fontWeight: 'bold',
    },

    statsCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#1C212B',
        borderWidth: 1,
        borderColor: '#303641',
        borderRadius: 18,
        padding: 18,
        marginTop: 22,
    },

    statIcon: {
        width: 52,
        height: 52,
        borderRadius: 14,
        backgroundColor: '#332519',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 15,
    },

    statInfo: {
        flex: 1,
    },

    statTitle: {
        color: '#FFFFFF',
        fontSize: 15,
        fontWeight: 'bold',
    },

    statSubtitle: {
        color: '#9CA3AF',
        fontSize: 12,
        marginTop: 5,
    },

    statValue: {
        color: '#FF7A00',
        fontSize: 28,
        fontWeight: 'bold',
    },

    logoutButton: {
        minHeight: 58,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 12,
        backgroundColor: '#2B1D24',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#63303A',
        marginTop: 30,
    },

    logoutText: {
        color: '#EF4444',
        fontSize: 16,
        fontWeight: 'bold',
    },

    pressed: {
        opacity: 0.8,
    },

    footer: {
        color: '#6B7280',
        fontSize: 10,
        fontWeight: 'bold',
        letterSpacing: 1,
        textAlign: 'center',
        marginTop: 30,
    },
});