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

import FuelTypePicker from './FuelTypePicker';
import { validateVehicle } from '../utils/vehicleValidation';

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
    const [isNewImageSelected, setIsNewImageSelected] =
        useState(false);

    const [isSaving, setIsSaving] = useState(false);

    const [errors, setErrors] = useState({});

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

        setNextOilChange(
            String(vehicleToEdit?.nextOilChange ?? '')
        );

        setImageUri(vehicleToEdit?.imageUri ?? null);
        setIsNewImageSelected(false);

        setErrors({});

    }, [visible, vehicleToEdit]);

    function updateField(setter, field, value) {
        setter(value);

        setErrors((currentErrors) => {
            if (!currentErrors[field]) {
                return currentErrors;
            }

            const updatedErrors = { ...currentErrors };

            delete updatedErrors[field];

            return updatedErrors;
        });
    }

    function handleSelectedImage(imageAsset) {
        if (!imageAsset?.uri) {
            return;
        }

        setImageUri(imageAsset.uri);
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

            const result =
                await ImagePicker.launchImageLibraryAsync({
                    mediaTypes: ['images'],
                    allowsEditing: true,
                    aspect: [16, 9],
                    quality: 0.8,
                });

            if (
                !result.canceled &&
                result.assets?.length > 0
            ) {
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

            const result =
                await ImagePicker.launchCameraAsync({
                    mediaTypes: ['images'],
                    allowsEditing: true,
                    aspect: [16, 9],
                    quality: 0.8,
                });

            if (
                !result.canceled &&
                result.assets?.length > 0
            ) {
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

    async function saveVehicleHandler() {
        if (isSaving) {
            return;
        }

        const validationErrors = validateVehicle({
            brand,
            model,
            year,
            fuelType,
            mileage,
            nextOilChange,
        });

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        setErrors({});
        setIsSaving(true);

        try {
            const vehicleData = {
                brand: brand.trim(),
                model: model.trim(),
                year: Number(year),
                fuelType: fuelType.trim(),
                mileage: Number(mileage),
                nextOilChange: Number(nextOilChange),

                imagePath:
                    vehicleToEdit?.imagePath ?? null,

                newImageUri:
                    isNewImageSelected ? imageUri : null,
            };

            if (isEditMode) {
                await onUpdateVehicle(
                    vehicleToEdit.id,
                    vehicleData
                );
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
            setIsNewImageSelected(false);
            setErrors({});

        } catch (error) {
            console.error('Save Vehicle Error:', error);

            Alert.alert(
                'Save Vehicle Error',
                error.message ||
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
                behavior={
                    Platform.OS === 'ios'
                        ? 'padding'
                        : 'height'
                }
            >
                <ScrollView
                    style={styles.container}
                    contentContainerStyle={styles.content}
                    keyboardShouldPersistTaps="handled"
                    automaticallyAdjustKeyboardInsets={
                        Platform.OS === 'ios'
                    }
                    showsVerticalScrollIndicator={false}
                >

                    <Text style={styles.title}>
                        {isEditMode
                            ? 'Edit Vehicle'
                            : 'Add Vehicle'}
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

                                <Text
                                    style={styles.imagePlaceholderText}
                                >
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

                    <Text style={styles.label}>
                        Brand
                    </Text>

                    <TextInput
                        style={[
                            styles.input,
                            errors.brand && styles.inputError,
                        ]}
                        placeholder="Enter vehicle brand"
                        placeholderTextColor="#888"
                        value={brand}
                        onChangeText={(value) =>
                            updateField(
                                setBrand,
                                'brand',
                                value
                            )
                        }
                    />

                    {errors.brand && (
                        <Text style={styles.errorText}>
                            {errors.brand}
                        </Text>
                    )}

                    <Text style={styles.label}>
                        Model
                    </Text>

                    <TextInput
                        style={[
                            styles.input,
                            errors.model && styles.inputError,
                        ]}
                        placeholder="Enter vehicle model"
                        placeholderTextColor="#888"
                        value={model}
                        onChangeText={(value) =>
                            updateField(
                                setModel,
                                'model',
                                value
                            )
                        }
                    />

                    {errors.model && (
                        <Text style={styles.errorText}>
                            {errors.model}
                        </Text>
                    )}

                    <Text style={styles.label}>
                        Year
                    </Text>

                    <TextInput
                        style={[
                            styles.input,
                            errors.year && styles.inputError,
                        ]}
                        placeholder="Enter production year"
                        placeholderTextColor="#888"
                        keyboardType="numeric"
                        value={year}
                        onChangeText={(value) =>
                            updateField(
                                setYear,
                                'year',
                                value
                            )
                        }
                    />

                    {errors.year && (
                        <Text style={styles.errorText}>
                            {errors.year}
                        </Text>
                    )}

                    <Text style={styles.label}>
                        Fuel Type
                    </Text>

                    <FuelTypePicker
                        value={fuelType}
                        onChange={(value) =>
                            updateField(
                                setFuelType,
                                'fuelType',
                                value
                            )
                        }
                        enabled={!isSaving}
                    />

                    {errors.fuelType && (
                        <Text style={styles.errorText}>
                            {errors.fuelType}
                        </Text>
                    )}

                    <Text style={styles.label}>
                        Mileage
                    </Text>

                    <TextInput
                        style={[
                            styles.input,
                            errors.mileage && styles.inputError,
                        ]}
                        placeholder="Enter current mileage"
                        placeholderTextColor="#888"
                        keyboardType="default"
                        value={mileage}
                        onChangeText={(value) =>
                            updateField(
                                setMileage,
                                'mileage',
                                value
                            )
                        }
                    />

                    {errors.mileage && (
                        <Text style={styles.errorText}>
                            {errors.mileage}
                        </Text>
                    )}

                    <Text style={styles.label}>
                        Next Oil Change
                    </Text>

                    <TextInput
                        style={[
                            styles.input,
                            errors.nextOilChange &&
                                styles.inputError,
                        ]}
                        placeholder="Enter next oil change mileage"
                        placeholderTextColor="#888"
                        keyboardType="default"
                        value={nextOilChange}
                        onChangeText={(value) =>
                            updateField(
                                setNextOilChange,
                                'nextOilChange',
                                value
                            )
                        }
                    />

                    {errors.nextOilChange && (
                        <Text style={styles.errorText}>
                            {errors.nextOilChange}
                        </Text>
                    )}

                    <Pressable
                        style={[
                            styles.saveButton,
                            isSaving && styles.disabledButton,
                        ]}
                        onPress={saveVehicleHandler}
                        disabled={isSaving}
                    >
                        {isSaving ? (
                            <ActivityIndicator
                                color="#FFFFFF"
                            />
                        ) : (
                            <>
                                <Ionicons
                                    name="save-outline"
                                    size={21}
                                    color="#FFFFFF"
                                />

                                <Text
                                    style={styles.saveButtonText}
                                >
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

    inputError: {
        borderWidth: 1,
        borderColor: '#F87171',
    },

    errorText: {
        color: '#FCA5A5',
        fontSize: 13,
        marginTop: -14,
        marginBottom: 16,
        marginLeft: 2,
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