import { useState } from 'react';
import {
    Modal,
    View,
    Text,
    TextInput,
    Pressable,
    StyleSheet,
} from 'react-native';

export default function AddVehicleForm({ visible, onClose }) {
    const [brand, setBrand] = useState('');
    const [model, setModel] = useState('');

    return (
        <Modal
            visible={visible}
            animationType="slide"
            onRequestClose={onClose}
        >
            <View style={styles.container}>
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

                <Pressable
                    style={styles.closeButton}
                    onPress={onClose}
                >
                    <Text style={styles.closeButtonText}>
                        Close
                    </Text>
                </Pressable>
            </View>
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
});