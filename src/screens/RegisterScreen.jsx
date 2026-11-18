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
    Alert,
    StyleSheet,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { useAuth } from '../context/AuthContext';

export default function RegisterScreen({ navigation }) {
    const { register } = useAuth();

    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    async function registerHandler() {
        setErrorMessage('');

        const trimmedName = fullName.trim();
        const trimmedEmail = email.trim();

        if (
            !trimmedName ||
            !trimmedEmail ||
            !password ||
            !confirmPassword
        ) {
            setErrorMessage('Please fill in all fields.');
            return;
        }

        if (trimmedName.length < 2) {
            setErrorMessage(
                'Full name must contain at least 2 characters.'
            );
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(trimmedEmail)) {
            setErrorMessage('Please enter a valid email address.');
            return;
        }

        if (password.length < 6) {
            setErrorMessage(
                'Password must contain at least 6 characters.'
            );
            return;
        }

        if (password !== confirmPassword) {
            setErrorMessage('Passwords do not match.');
            return;
        }

        setIsLoading(true);

        try {
            const { data, error } = await register(
                trimmedEmail,
                password,
                trimmedName
            );

            if (error) {
                setErrorMessage(error.message);
                return;
            }

            if (!data.session) {
                Alert.alert(
                    'Check Your Email',
                    'Your registration was submitted. Please check your email to confirm your account before signing in.',
                    [
                        {
                            text: 'OK',
                            onPress: () =>
                                navigation.navigate('Login'),
                        },
                    ]
                );
            }

        } catch (error) {
            console.error('Register Error:', error);

            setErrorMessage(
                'Unable to create your account. Please try again.'
            );
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
                    <View style={styles.headerIcon}>
                        <Ionicons
                            name="person-add-outline"
                            size={40}
                            color="#FF7A00"
                        />
                    </View>

                    <Text style={styles.title}>
                        Create Account
                    </Text>

                    <Text style={styles.subtitle}>
                        Start your journey with AutoCare.
                    </Text>

                    <View style={styles.formContainer}>
                        <View style={styles.inputGroup}>
                            <Text style={styles.inputLabel}>
                                FULL NAME
                            </Text>

                            <View style={styles.inputContainer}>
                                <Ionicons
                                    name="person-outline"
                                    size={21}
                                    color="#9CA3AF"
                                />

                                <TextInput
                                    style={styles.input}
                                    placeholder="Your full name"
                                    placeholderTextColor="#6B7280"
                                    autoCapitalize="words"
                                    autoComplete="name"
                                    value={fullName}
                                    onChangeText={setFullName}
                                />
                            </View>
                        </View>

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
                                    placeholder="Create password"
                                    placeholderTextColor="#6B7280"
                                    secureTextEntry={!showPassword}
                                    autoComplete="new-password"
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

                        <View style={styles.inputGroup}>
                            <Text style={styles.inputLabel}>
                                CONFIRM PASSWORD
                            </Text>

                            <View style={styles.inputContainer}>
                                <Ionicons
                                    name="shield-checkmark-outline"
                                    size={21}
                                    color="#9CA3AF"
                                />

                                <TextInput
                                    style={styles.input}
                                    placeholder="Confirm password"
                                    placeholderTextColor="#6B7280"
                                    secureTextEntry={!showPassword}
                                    autoComplete="new-password"
                                    value={confirmPassword}
                                    onChangeText={setConfirmPassword}
                                />
                            </View>
                        </View>

                        {errorMessage ? (
                            <Text style={styles.errorText}>
                                {errorMessage}
                            </Text>
                        ) : null}

                        <Pressable
                            style={({ pressed }) => [
                                styles.registerButton,
                                pressed && styles.buttonPressed,
                                isLoading && styles.disabledButton,
                            ]}
                            onPress={registerHandler}
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <ActivityIndicator color="#FFFFFF" />
                            ) : (
                                <>
                                    <Text style={styles.registerButtonText}>
                                        Create Account
                                    </Text>

                                    <Ionicons
                                        name="arrow-forward"
                                        size={21}
                                        color="#FFFFFF"
                                    />
                                </>
                            )}
                        </Pressable>

                        <View style={styles.loginContainer}>
                            <Text style={styles.loginText}>
                                Already have an account?
                            </Text>

                            <Pressable
                                onPress={() =>
                                    navigation.navigate('Login')
                                }
                            >
                                <Text style={styles.loginLink}>
                                    Sign In
                                </Text>
                            </Pressable>
                        </View>
                    </View>
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
        paddingTop: 30,
        paddingBottom: 40,
        alignItems: 'center',
    },

    headerIcon: {
        width: 85,
        height: 85,
        borderRadius: 25,
        backgroundColor: '#1C212B',
        borderWidth: 1,
        borderColor: '#303641',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 22,
    },

    title: {
        color: '#FFFFFF',
        fontSize: 29,
        fontWeight: 'bold',
    },

    subtitle: {
        color: '#9CA3AF',
        fontSize: 14,
        marginTop: 8,
        marginBottom: 30,
    },

    formContainer: {
        width: '100%',
        backgroundColor: '#1C212B',
        borderRadius: 24,
        borderWidth: 1,
        borderColor: '#303641',
        padding: 24,
    },

    inputGroup: {
        marginBottom: 20,
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

    registerButton: {
        backgroundColor: '#FF7A00',
        borderRadius: 14,
        minHeight: 56,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 12,
        marginTop: 5,
    },

    registerButtonText: {
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

    loginContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: 6,
        marginTop: 25,
    },

    loginText: {
        color: '#9CA3AF',
        fontSize: 13,
    },

    loginLink: {
        color: '#FF7A00',
        fontSize: 13,
        fontWeight: 'bold',
    },
});