import { useState, useEffect } from 'react';

import {
    View,
    Modal,
    Text,
    TextInput,
    Image,
    Pressable,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Alert,
    ActivityIndicator,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system/legacy';

export default function AddVehicleForm({
    visible,
    onClose,
    onAddVehicle,
    onUpdateVehicle,
    vehicleToEdit,
}) {
    const [brand, setBrand] = useState('');
    const [model, setModel] = useState('');
    const [year, setYear] = useState('');
    const [fuelType, setFuelType] = useState('');
    const [mileage, setMileage] = useState('');
    const [nextOilChange, setNextOilChange] = useState('');

    const [imageUri, setImageUri] = useState(null);
    const [imageExtension, setImageExtension] = useState('jpg');
    const [isNewImageSelected, setIsNewImageSelected] = useState(false);

    const [isSaving, setIsSaving] = useState(false);

    const isEditMode = Boolean(vehicleToEdit);

    useEffect(() => {
        if (!visible) {
            return;
        }

        setBrand(vehicleToEdit?.brand ?? '');
        setModel(vehicleToEdit?.model ?? '');
        setYear(String(vehicleToEdit?.year ?? ''));
        setFuelType(vehicleToEdit?.fuelType ?? '');
        setMileage(String(vehicleToEdit?.mileage ?? ''));
        setNextOilChange(String(vehicleToEdit?.nextOilChange ?? ''));

        setImageUri(vehicleToEdit?.imageUri ?? null);
        setImageExtension('jpg');
        setIsNewImageSelected(false);
    }, [visible, vehicleToEdit]);

    function handleSelectedImage(imageAsset) {
        if (!imageAsset?.uri) {
            return;
        }

        const extension = imageAsset.mimeType === 'image/png'
            ? 'png'
            : imageAsset.mimeType === 'image/heic'
                ? 'heic'
                : 'jpg';

        setImageUri(imageAsset.uri);
        setImageExtension(extension);
        setIsNewImageSelected(true);
    }

    async function pickImageHandler() {
        try {
            const permission =
                await ImagePicker.requestMediaLibraryPermissionsAsync();

            if (!permission.granted) {
                Alert.alert(
                    'Permission Required',
                    'Please allow access to your photo library.'
                );

                return;
            }

            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ['images'],
                allowsEditing: true,
                aspect: [16, 9],
                quality: 0.8,
            });

            if (!result.canceled && result.assets?.length > 0) {
                handleSelectedImage(result.assets[0]);
            }

        } catch (error) {
            console.error('ImagePicker Error:', error);

            Alert.alert(
                'Error',
                'Unable to select an image.'
            );
        }
    }

    async function takePhotoHandler() {
        try {
            const permission =
                await ImagePicker.requestCameraPermissionsAsync();

            if (!permission.granted) {
                Alert.alert(
                    'Camera Permission Required',
                    'Please allow AutoCare to access your camera.'
                );

                return;
            }

            const result = await ImagePicker.launchCameraAsync({
                mediaTypes: ['images'],
                allowsEditing: true,
                aspect: [16, 9],
                quality: 0.8,
            });

            if (!result.canceled && result.assets?.length > 0) {
                handleSelectedImage(result.assets[0]);
            }

        } catch (error) {
            console.error('Camera Error:', error);

            Alert.alert(
                'Camera Error',
                'Unable to open the camera.'
            );
        }
    }

    async function saveImageLocally(uri) {
        const directory =
            `${FileSystem.documentDirectory}vehicle-images/`;

        await FileSystem.makeDirectoryAsync(directory, {
            intermediates: true,
        });

        const fileName =
            `vehicle-${Date.now()}-${Math.floor(Math.random() * 1000000)}.${imageExtension}`;

        const permanentUri = `${directory}${fileName}`;

        await FileSystem.copyAsync({
            from: uri,
            to: permanentUri,
        });

        return permanentUri;
    }

    async function saveVehicleHandler() {
        if (isSaving) {
            return;
        }

        setIsSaving(true);

        try {
            let savedImageUri = imageUri;

            if (isNewImageSelected && imageUri) {
                savedImageUri = await saveImageLocally(imageUri);
            }

            const vehicleData = {
                brand: brand.trim(),
                model: model.trim(),
                year: Number(year),
                fuelType: fuelType.trim(),
                mileage: Number(mileage),
                nextOilChange: Number(nextOilChange),
                imageUri: savedImageUri,
            };

            if (isEditMode) {
                await onUpdateVehicle(vehicleToEdit.id, vehicleData);
            } else {
                await onAddVehicle(vehicleData);
            }

            setBrand('');
            setModel('');
            setYear('');
            setFuelType('');
            setMileage('');
            setNextOilChange('');
            setImageUri(null);
            setImageExtension('jpg');
            setIsNewImageSelected(false);

        } catch (error) {
            console.error('Save Vehicle Error:', error);

            Alert.alert(
                'Error',
                'Unable to save the vehicle.'
            );
        } finally {
            setIsSaving(false);
        }
    }

    return (
        <Modal
            visible={visible}
            animationType="slide"
            onRequestClose={onClose}
        >
            <KeyboardAvoidingView
                style={styles.keyboardContainer}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
                <ScrollView
                    style={styles.container}
                    contentContainerStyle={styles.content}
                    keyboardShouldPersistTaps="handled"
                    automaticallyAdjustKeyboardInsets={Platform.OS === 'ios'}
                    showsVerticalScrollIndicator={false}
                >
                    <Text style={styles.title}>
                        {isEditMode ? 'Edit Vehicle' : 'Add Vehicle'}
                    </Text>

                    <Text style={styles.sectionTitle}>
                        Vehicle Photo
                    </Text>

                    <View style={styles.imageContainer}>
                        {imageUri ? (
                            <Image
                                source={{ uri: imageUri }}
                                style={styles.vehicleImage}
                                resizeMode="cover"
                            />
                        ) : (
                            <View style={styles.imagePlaceholder}>
                                <Ionicons
                                    name="car-sport-outline"
                                    size={70}
                                    color="#FF7A00"
                                />

                                <Text style={styles.imagePlaceholderText}>
                                    Add your vehicle photo
                                </Text>
                            </View>
                        )}
                    </View>

                    <View style={styles.imageActions}>

                        <Pressable
                            style={styles.imageButton}
                            onPress={pickImageHandler}
                            disabled={isSaving}
                        >
                            <Ionicons
                                name="images-outline"
                                size={22}
                                color="#FF7A00"
                            />

                            <Text style={styles.imageButtonText}>
                                Choose From Gallery
                            </Text>
                        </Pressable>

                        <Pressable
                            style={styles.cameraButton}
                            onPress={takePhotoHandler}
                            disabled={isSaving}
                        >
                            <Ionicons
                                name="camera-outline"
                                size={22}
                                color="#FFFFFF"
                            />

                            <Text style={styles.cameraButtonText}>
                                Take Photo
                            </Text>
                        </Pressable>

                    </View>

                    <Text style={styles.sectionTitle}>
                        Vehicle Information
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

                    <Text style={styles.label}>
                        Next Oil Change
                    </Text>

                    <TextInput
                        style={styles.input}
                        placeholder="Enter next oil change mileage"
                        placeholderTextColor="#888"
                        keyboardType="numeric"
                        value={nextOilChange}
                        onChangeText={setNextOilChange}
                    />

                    <Pressable
                        style={[
                            styles.saveButton,
                            isSaving && styles.disabledButton,
                        ]}
                        onPress={saveVehicleHandler}
                        disabled={isSaving}
                    >
                        {isSaving ? (
                            <ActivityIndicator color="#FFFFFF" />
                        ) : (
                            <>
                                <Ionicons
                                    name="save-outline"
                                    size={21}
                                    color="#FFFFFF"
                                />

                                <Text style={styles.saveButtonText}>
                                    Save Vehicle
                                </Text>
                            </>
                        )}
                    </Pressable>

                    <Pressable
                        style={styles.closeButton}
                        onPress={onClose}
                        disabled={isSaving}
                    >
                        <Text style={styles.closeButtonText}>
                            Close
                        </Text>
                    </Pressable>

                </ScrollView>
            </KeyboardAvoidingView>
        </Modal>
    );
}

const styles = StyleSheet.create({
    keyboardContainer: {
        flex: 1,
        backgroundColor: '#0F1117',
    },

    container: {
        flex: 1,
        backgroundColor: '#0F1117',
    },

    content: {
        paddingHorizontal: 24,
        paddingTop: 65,
        paddingBottom: 60,
    },

    title: {
        color: '#FFFFFF',
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 30,
    },

    sectionTitle: {
        color: '#FFFFFF',
        fontSize: 19,
        fontWeight: 'bold',
        marginBottom: 15,
        marginTop: 10,
    },

    imageContainer: {
        width: '100%',
        height: 210,
        backgroundColor: '#1C212B',
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#303641',
        overflow: 'hidden',
        marginBottom: 15,
    },

    vehicleImage: {
        width: '100%',
        height: '100%',
    },

    imagePlaceholder: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 12,
    },

    imagePlaceholderText: {
        color: '#9CA3AF',
        fontSize: 14,
    },

    imageActions: {
        gap: 12,
        marginBottom: 30,
    },

    imageButton: {
        backgroundColor: '#332519',
        borderWidth: 1,
        borderColor: '#FF7A00',
        borderRadius: 12,
        padding: 15,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 10,
    },

    imageButtonText: {
        color: '#FF7A00',
        fontSize: 15,
        fontWeight: 'bold',
    },

    cameraButton: {
        backgroundColor: '#FF7A00',
        borderRadius: 12,
        padding: 15,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 10,
    },

    cameraButtonText: {
        color: '#FFFFFF',
        fontSize: 15,
        fontWeight: 'bold',
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

    saveButton: {
        backgroundColor: '#FF7A00',
        padding: 16,
        borderRadius: 12,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 10,
        marginTop: 20,
    },

    saveButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
    },

    disabledButton: {
        opacity: 0.6,
    },

    closeButton: {
        backgroundColor: '#1C212B',
        borderWidth: 1,
        borderColor: '#303641',
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 12,
    },

    closeButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
});