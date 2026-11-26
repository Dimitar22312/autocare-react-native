import {
    View,
    Modal,
    Text,
    Pressable,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    ActivityIndicator,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';

import VehiclePhotoPicker from './vehicles/VehiclePhotoPicker';
import VehicleFormFields from './vehicles/VehicleFormFields';

import useVehicleForm from '../hooks/useVehicleForm';

export default function AddVehicleForm({
    visible,
    onClose,
    onAddVehicle,
    onUpdateVehicle,
    vehicleToEdit,
}) {
    const {
        brand,
        model,
        year,
        fuelType,
        mileage,
        nextOilChange,
        imageUri,
        isSaving,
        errors,
        isEditMode,
        updateField,
        handleSelectedImage,
        saveVehicleHandler,
    } = useVehicleForm({
        visible,
        vehicleToEdit,
        onAddVehicle,
        onUpdateVehicle,
    });

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

                    <VehiclePhotoPicker
                        imageUri={imageUri}
                        onImageSelected={handleSelectedImage}
                        disabled={isSaving}
                    />

                    <VehicleFormFields
                        brand={brand}
                        model={model}
                        year={year}
                        fuelType={fuelType}
                        mileage={mileage}
                        nextOilChange={nextOilChange}
                        errors={errors}
                        disabled={isSaving}
                        onFieldChange={updateField}
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