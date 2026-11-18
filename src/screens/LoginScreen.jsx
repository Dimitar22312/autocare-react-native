import { useState } from 'react';

import {
    View,
    Text,
    TextInput,
    Pressable,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    ActivityIndicator,
    StyleSheet,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { useAuth } from '../context/AuthContext';

export default function LoginScreen({ navigation }) {
    const { login } = useAuth();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    async function loginHandler() {
        setErrorMessage('');

        const trimmedEmail = email.trim();

        if (!trimmedEmail || !password) {
            setErrorMessage('Please fill in all fields.');
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(trimmedEmail)) {
            setErrorMessage('Please enter a valid email address.');
            return;
        }

        setIsLoading(true);

        try {
            const { error } = await login(
                trimmedEmail,
                password
            );

            if (error) {
                setErrorMessage(error.message);
            }
        } catch (error) {
            setErrorMessage(
                'Unable to sign in. Please try again.'
            );

            console.error('Login Error:', error);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
                style={styles.container}
                behavior={
                    Platform.OS === 'ios' ? 'padding' : undefined
                }
            >
                <ScrollView
                    contentContainerStyle={styles.content}
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                >
                    <View style={styles.logoContainer}>
                        <Ionicons
                            name="car-sport"
                            size={55}
                            color="#FF7A00"
                        />
                    </View>

                    <Text style={styles.brandTitle}>
                        Auto
                        <Text style={styles.brandAccent}>
                            Care
                        </Text>
                    </Text>

                    <Text style={styles.brandSubtitle}>
                        YOUR VEHICLE COMPANION
                    </Text>

                    <View style={styles.formContainer}>
                        <Text style={styles.title}>
                            Welcome Back
                        </Text>

                        <Text style={styles.subtitle}>
                            Sign in to manage your garage.
                        </Text>

                        <View style={styles.inputGroup}>
                            <Text style={styles.inputLabel}>
                                EMAIL ADDRESS
                            </Text>

                            <View style={styles.inputContainer}>
                                <Ionicons
                                    name="mail-outline"
                                    size={21}
                                    color="#9CA3AF"
                                />

                                <TextInput
                                    style={styles.input}
                                    placeholder="Enter your email"
                                    placeholderTextColor="#6B7280"
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                    autoComplete="email"
                                    value={email}
                                    onChangeText={setEmail}
                                />
                            </View>
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.inputLabel}>
                                PASSWORD
                            </Text>

                            <View style={styles.inputContainer}>
                                <Ionicons
                                    name="lock-closed-outline"
                                    size={21}
                                    color="#9CA3AF"
                                />

                                <TextInput
                                    style={styles.input}
                                    placeholder="Enter your password"
                                    placeholderTextColor="#6B7280"
                                    secureTextEntry={!showPassword}
                                    autoComplete="current-password"
                                    value={password}
                                    onChangeText={setPassword}
                                />

                                <Pressable
                                    onPress={() =>
                                        setShowPassword(!showPassword)
                                    }
                                >
                                    <Ionicons
                                        name={
                                            showPassword
                                                ? 'eye-off-outline'
                                                : 'eye-outline'
                                        }
                                        size={21}
                                        color="#9CA3AF"
                                    />
                                </Pressable>
                            </View>
                        </View>

                        {errorMessage ? (
                            <Text style={styles.errorText}>
                                {errorMessage}
                            </Text>
                        ) : null}

                        <Pressable
                            style={({ pressed }) => [
                                styles.loginButton,
                                pressed && styles.buttonPressed,
                                isLoading && styles.disabledButton,
                            ]}
                            onPress={loginHandler}
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <ActivityIndicator color="#FFFFFF" />
                            ) : (
                                <>
                                    <Text style={styles.loginButtonText}>
                                        Sign In
                                    </Text>

                                    <Ionicons
                                        name="arrow-forward"
                                        size={21}
                                        color="#FFFFFF"
                                    />
                                </>
                            )}
                        </Pressable>

                        <View style={styles.registerContainer}>
                            <Text style={styles.registerText}>
                                Don't have an account?
                            </Text>

                            <Pressable
                                onPress={() =>
                                    navigation.navigate('Register')
                                }
                            >
                                <Text style={styles.registerLink}>
                                    Create Account
                                </Text>
                            </Pressable>
                        </View>
                    </View>

                    <Text style={styles.footer}>
                        DRIVE SMART. STAY READY.
                    </Text>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0F1117',
    },

    content: {
        flexGrow: 1,
        paddingHorizontal: 24,
        paddingTop: 40,
        paddingBottom: 40,
        alignItems: 'center',
    },

    logoContainer: {
        width: 100,
        height: 100,
        borderRadius: 30,
        backgroundColor: '#1C212B',
        borderWidth: 1,
        borderColor: '#303641',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
    },

    brandTitle: {
        color: '#FFFFFF',
        fontSize: 38,
        fontWeight: 'bold',
        letterSpacing: -1,
    },

    brandAccent: {
        color: '#FF7A00',
    },

    brandSubtitle: {
        color: '#FF7A00',
        fontSize: 10,
        fontWeight: 'bold',
        letterSpacing: 3,
        marginTop: 8,
        marginBottom: 40,
    },

    formContainer: {
        width: '100%',
        backgroundColor: '#1C212B',
        borderRadius: 24,
        borderWidth: 1,
        borderColor: '#303641',
        padding: 24,
    },

    title: {
        color: '#FFFFFF',
        fontSize: 26,
        fontWeight: 'bold',
        marginBottom: 8,
    },

    subtitle: {
        color: '#9CA3AF',
        fontSize: 14,
        marginBottom: 30,
    },

    inputGroup: {
        marginBottom: 22,
    },

    inputLabel: {
        color: '#9CA3AF',
        fontSize: 11,
        fontWeight: 'bold',
        letterSpacing: 1,
        marginBottom: 10,
    },

    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#141820',
        borderWidth: 1,
        borderColor: '#303641',
        borderRadius: 14,
        paddingHorizontal: 15,
        minHeight: 56,
        gap: 12,
    },

    input: {
        flex: 1,
        color: '#FFFFFF',
        fontSize: 15,
        paddingVertical: 12,
    },

    errorText: {
        color: '#EF4444',
        fontSize: 13,
        marginBottom: 18,
        lineHeight: 20,
    },

    loginButton: {
        backgroundColor: '#FF7A00',
        borderRadius: 14,
        minHeight: 56,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 12,
        marginTop: 8,
    },

    loginButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
    },

    buttonPressed: {
        opacity: 0.85,
    },

    disabledButton: {
        opacity: 0.6,
    },

    registerContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        marginTop: 28,
    },

    registerText: {
        color: '#9CA3AF',
        fontSize: 13,
    },

    registerLink: {
        color: '#FF7A00',
        fontSize: 13,
        fontWeight: 'bold',
    },

    footer: {
        color: '#6B7280',
        fontSize: 10,
        fontWeight: 'bold',
        letterSpacing: 2,
        marginTop: 35,
    },
});