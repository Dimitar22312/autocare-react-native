import { useState } from 'react';
import {
    Modal,
    View,
    Text,
    TextInput,
    Pressable,
    StyleSheet,
} from 'react-native';
import { ScrollView } from 'react-native';

export default function AddVehicleForm({ visible, onClose }) {
    const [brand, setBrand] = useState('');
    const [model, setModel] = useState('');
    const [year, setYear] = useState('');
    const [fuelType, setFuelType] = useState('');
    const [mileage, setMileage] = useState('');
    const [nextOilChange, setNextOilChange] = useState('');

    return (
        <Modal
            visible={visible}
            animationType="slide"
            onRequestClose={onClose}
        >
            <ScrollView 
                style={styles.container}
                contentContainerStyle={styles.content}
                keyboardShouldPersistTaps="handled"
            >
                <Text style={styles.title}>
                    Add Vehicle
                </Text>

                <Text style={styles.label}>Brand</Text>

                <TextInput
                    style={styles.input}
                    placeholder="Enter vehicle brand"
                    placeholderTextColor="#888"
                    value={brand}
                    onChangeText={setBrand}
                />

                <Text style={styles.label}>Model</Text>

                <TextInput
                    style={styles.input}
                    placeholder="Enter vehicle model"
                    placeholderTextColor="#888"
                    value={model}
                    onChangeText={setModel}
                />

                <Text style={styles.label}>Year</Text>

                <TextInput
                    style={styles.input}
                    placeholder="Enter production year"
                    placeholderTextColor="#888"
                    keyboardType="numeric"
                    value={year}
                    onChangeText={setYear}
                />

                <Text style={styles.label}>Fuel Type</Text>

                <TextInput
                    style={styles.input}
                    placeholder="Petrol, Diesel, Electric..."
                    placeholderTextColor="#888"
                    value={fuelType}
                    onChangeText={setFuelType}
                />

                <Text style={styles.label}>Mileage</Text>

                <TextInput
                    style={styles.input}
                    placeholder="Enter current mileage"
                    placeholderTextColor="#888"
                    keyboardType="numeric"
                    value={mileage}
                    onChangeText={setMileage}
                />

                <Text style={styles.label}>Next Oil Change</Text>

                <TextInput
                    style={styles.input}
                    placeholder="Enter next oil change mileage"
                    placeholderTextColor="#888"
                    keyboardType="numeric"
                    value={nextOilChange}
                    onChangeText={setNextOilChange}
                />

                <Pressable
                    style={styles.closeButton}
                    onPress={onClose}
                >
                    <Text style={styles.closeButtonText}>
                        Close
                    </Text>
                </Pressable>
            </ScrollView>
        </Modal>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0F1117',
        padding: 24,
        paddingTop: 80,
    },
    title: {
        color: '#FFFFFF',
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 30,
    },
    label: {
        color: '#FFFFFF',
        fontSize: 16,
        marginBottom: 8,
    },
    input: {
        backgroundColor: '#1C212B',
        color: '#FFFFFF',
        padding: 15,
        borderRadius: 10,
        marginBottom: 20,
        fontSize: 16,
    },
    closeButton: {
        backgroundColor: '#FF7A00',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 20,
    },
    closeButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
    content: {
    paddingBottom: 60,
},
});