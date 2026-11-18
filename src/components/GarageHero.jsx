import { View, Text, Image, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function GarageHero() {
    return (
        <View style={styles.container}>
            <Image
                source={require('../../assets/bmw-hero.png')}
                style={styles.backgroundCar}
                resizeMode="contain"
                pointerEvents="none"
                accessible={false}
            />

            <View style={styles.brandRow}>
                <Ionicons name="car-sport" size={30} color="#FF7A00" />

                <Text style={styles.brandName}>
                    Auto<Text style={styles.brandAccent}>Care</Text>
                </Text>
            </View>

            <View style={styles.headlineContainer}>
                <Text style={styles.eyebrow}>YOUR VEHICLE COMPANION</Text>
                <Text style={styles.headline}>My Garage</Text>
                <View style={styles.orangeLine} />
                <Text style={styles.subtitle}>
                    Keep your vehicles in perfect shape.
                </Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        height: 248,
        width: '100%',
        overflow: 'hidden',
        position: 'relative',
        marginBottom: 22,
    },
    backgroundCar: {
        position: 'absolute',
        right: -45,
        top: 36,
        width: 370,
        height: 190,
        opacity: 0.98,
    },
    brandRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        paddingTop: 8,
    },
    brandName: {
        color: '#FFFFFF',
        fontSize: 27,
        fontWeight: '800',
        letterSpacing: -0.7,
    },
    brandAccent: {
        color: '#FF7A00',
    },
    headlineContainer: {
        marginTop: 44,
        alignItems: 'flex-start',
    },
    eyebrow: {
        color: '#FF7A00',
        fontSize: 10,
        fontWeight: '700',
        letterSpacing: 1.6,
        marginBottom: 10,
    },
    headline: {
        color: '#FFFFFF',
        fontSize: 35,
        fontWeight: '800',
        letterSpacing: -1,
        textShadowColor: 'rgba(15,17,23,0.95)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 10,
    },
    orangeLine: {
        height: 4,
        width: 56,
        backgroundColor: '#FF7A00',
        borderRadius: 8,
        marginTop: 16,
    },
    subtitle: {
        color: '#A7ADB7',
        fontSize: 12,
        marginTop: 13,
        textShadowColor: '#0F1117',
        textShadowRadius: 6,
    },
});
