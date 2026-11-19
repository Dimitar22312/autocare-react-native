import { useState } from 'react';

import {
    View,
    Text,
    Pressable,
    Modal,
    StyleSheet,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';

const FUEL_TYPES = [
    'Petrol',
    'Diesel',
    'Hybrid',
    'Plug-in Hybrid',
    'Electric',
    'LPG',
    'CNG',
];

export default function FuelTypePicker({
    value,
    onChange,
    enabled = true,
}) {
    const [modalVisible, setModalVisible] = useState(false);

    function openPickerHandler() {
        if (!enabled) {
            return;
        }

        setModalVisible(true);
    }

    function closePickerHandler() {
        setModalVisible(false);
    }

    function selectFuelTypeHandler(selectedFuelType) {
        onChange(selectedFuelType);
        closePickerHandler();
    }

    return (
        <>
            <Pressable
                style={[
                    styles.pickerButton,
                    !enabled && styles.disabledButton,
                ]}
                onPress={openPickerHandler}
                disabled={!enabled}
            >
                <View style={styles.selectedValueContainer}>
                    <Ionicons
                        name="water-outline"
                        size={22}
                        color="#FF7A00"
                    />

                    <Text
                        style={[
                            styles.selectedValue,
                            !value && styles.placeholder,
                        ]}
                    >
                        {value || 'Select Fuel Type'}
                    </Text>
                </View>

                <Ionicons
                    name="chevron-down"
                    size={22}
                    color="#FF7A00"
                />
            </Pressable>

            <Modal
                visible={modalVisible}
                transparent
                animationType="fade"
                onRequestClose={closePickerHandler}
            >
                <View style={styles.modalOverlay}>
                    <Pressable
                        style={StyleSheet.absoluteFill}
                        onPress={closePickerHandler}
                    />

                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <View>
                                <Text style={styles.modalTitle}>
                                    Fuel Type
                                </Text>

                                <Text style={styles.modalSubtitle}>
                                    Select your vehicle's fuel type
                                </Text>
                            </View>

                            <Pressable
                                style={styles.closeIconButton}
                                onPress={closePickerHandler}
                            >
                                <Ionicons
                                    name="close"
                                    size={22}
                                    color="#9CA3AF"
                                />
                            </Pressable>
                        </View>

                        <View style={styles.optionsContainer}>
                            {FUEL_TYPES.map((fuel) => {
                                const isSelected = value === fuel;

                                return (
                                    <Pressable
                                        key={fuel}
                                        style={[
                                            styles.option,
                                            isSelected &&
                                                styles.selectedOption,
                                        ]}
                                        onPress={() =>
                                            selectFuelTypeHandler(fuel)
                                        }
                                    >
                                        <View
                                            style={
                                                styles.optionContent
                                            }
                                        >
                                            <Ionicons
                                                name="car-sport-outline"
                                                size={21}
                                                color={
                                                    isSelected
                                                        ? '#FF7A00'
                                                        : '#9CA3AF'
                                                }
                                            />

                                            <Text
                                                style={[
                                                    styles.optionText,
                                                    isSelected &&
                                                        styles.selectedOptionText,
                                                ]}
                                            >
                                                {fuel}
                                            </Text>
                                        </View>

                                        {isSelected && (
                                            <Ionicons
                                                name="checkmark-circle"
                                                size={23}
                                                color="#FF7A00"
                                            />
                                        )}
                                    </Pressable>
                                );
                            })}
                        </View>

                        <Pressable
                            style={styles.cancelButton}
                            onPress={closePickerHandler}
                        >
                            <Text style={styles.cancelButtonText}>
                                Cancel
                            </Text>
                        </Pressable>
                    </View>
                </View>
            </Modal>
        </>
    );
}

const styles = StyleSheet.create({
    pickerButton: {
        backgroundColor: '#1C212B',
        borderWidth: 1,
        borderColor: '#303641',
        borderRadius: 12,
        paddingHorizontal: 16,
        height: 54,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },

    disabledButton: {
        opacity: 0.6,
    },

    selectedValueContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },

    selectedValue: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '500',
    },

    placeholder: {
        color: '#9CA3AF',
        fontWeight: '400',
    },

    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
        justifyContent: 'center',
        paddingHorizontal: 24,
    },

    modalContent: {
        backgroundColor: '#1C212B',
        borderRadius: 24,
        borderWidth: 1,
        borderColor: '#303641',
        padding: 20,
    },

    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 24,
    },

    modalTitle: {
        color: '#FFFFFF',
        fontSize: 23,
        fontWeight: 'bold',
        marginBottom: 6,
    },

    modalSubtitle: {
        color: '#9CA3AF',
        fontSize: 13,
    },

    closeIconButton: {
        width: 34,
        height: 34,
        backgroundColor: '#292F3A',
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },

    optionsContainer: {
        gap: 8,
    },

    option: {
        backgroundColor: '#242A35',
        borderWidth: 1,
        borderColor: 'transparent',
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 14,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },

    selectedOption: {
        backgroundColor: '#332519',
        borderColor: '#FF7A00',
    },

    optionContent: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },

    optionText: {
        color: '#D1D5DB',
        fontSize: 16,
    },

    selectedOptionText: {
        color: '#FF7A00',
        fontWeight: 'bold',
    },

    cancelButton: {
        backgroundColor: '#303641',
        borderRadius: 12,
        paddingVertical: 15,
        alignItems: 'center',
        marginTop: 20,
    },

    cancelButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
});