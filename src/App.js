import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';

export default function App() {
    return (
        <View style={styles.container}>
           <StatusBar barStyle="light-content" />

           <Text style={styles.title}>AutoCare</Text>

           <Text style={styles.subtitle}>
                Your personal vehicle maintenance tracker
           </Text>

           <View style={styles.carCard}>
                <Text style={styles.carIcon}>🚗</Text>

                <Text style={styles.carName}>BMW 320d</Text>
                <Text style={styles.carInfo}>2018 • Diesel</Text>

                <View style={styles.divider} />

                <Text style={styles.label}>Current Mileage</Text>
                <Text style={styles.mileage}>120,000 km</Text>

                <Text style={styles.label}>Next Oil Change</Text>
                <Text style={styles.serviceText}>130,000 km</Text>
           </View>

           <Text style={styles.footer}>AutoCare © 2026</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0F1117',
        paddingHorizontal: 24,
        paddingTop: 70,
    },
    title: {
        fontSize: 36,
        fontWeight: 'bold',
        color: '#FF7A00',
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 14,
        color: '#9CA3AF',
        textAlign: 'center',
        marginTop: 8,
    },
    carCard: {
        backgroundColor: '#1C212B',
        borderRadius: 20,
        padding: 24,
        marginTop: 40,
    },
    carIcon: {
        fontSize: 48,
        textAlign: 'center',
        marginBottom: 12,
    },
    carName: {
        fontSize: 26,
        fontWeight: 'bold',
        color: '#FFFFFF',
        textAlign: 'center',
    },
    carInfo: {
        fontSize: 14,
        color: '#9CA3AF',
        textAlign: 'center',
        marginTop: 6,
    },
    divider: {
        height: 1,
        backgroundColor: '#343A46',
        marginVertical: 24,
    },
    label: {
        fontSize: 14,
        color: '#9CA3AF',
        marginBottom: 8,
    },
    mileage: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#FFFFFF',
        marginBottom: 24,
    },
    serviceText: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#FF7A00',
    },
    footer: {
        color: '#6B7280',
        textAlign: 'center',
        marginTop: 30,
        fontSize: 12,
    },
});




