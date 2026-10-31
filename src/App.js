import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import VehicleCard from './components/VehicleCard';

export default function App() {
    const vehicle = {
        brand: 'BMW',
        model: '320d',
        year: 2018,
        fuelType: 'Diesel',
        mileage: 120000,
        nextOilChange: 130000,
    };
    
    return (
        <View style={styles.container}>
           <StatusBar barStyle="light-content" />

           <Text style={styles.title}>AutoCare</Text>

           <Text style={styles.subtitle}>
                Your personal vehicle maintenance tracker
           </Text>

           <VehicleCard vehicle={vehicle} />

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
    
    footer: {
        color: '#6B7280',
        textAlign: 'center',
        marginTop: 30,
        fontSize: 12,
    },
});




