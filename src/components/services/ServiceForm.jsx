import {
    View,
    Text,
    TextInput,
    Pressable,
    StyleSheet,
    ActivityIndicator,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';

const SERVICE_TYPES = [
    'Oil Change',
    'Filters',
    'Brakes',
    'Tires',
    'Inspection',
    'Other',
];

export default function ServiceForm({
    isEditMode,
    serviceType,
    setServiceType,
    serviceDate,
    mileage,
    setMileage,
    cost,
    setCost,
    notes,
    setNotes,
    isSaving,
    onOpenDatePicker,
    onSave,
    onCancel,
}) {
    return (
        <View style={styles.formCard}>

            <View style={styles.formHeader}>
                <View>
                    <Text style={styles.formTitle}>
                        {isEditMode
                            ? 'Edit Service'
                            : 'New Service'}
                    </Text>

                    <Text style={styles.formSubtitle}>
                        {isEditMode
                            ? 'Update maintenance details'
                            : 'Record vehicle maintenance'}
                    </Text>
                </View>

                <Pressable
                    onPress={onCancel}
                    disabled={isSaving}
                    style={styles.closeIconButton}
                >
                    <Ionicons
                        name="close"
                        size={22}
                        color="#9CA3AF"
                    />
                </Pressable>
            </View>

            <Text style={styles.label}>
                Service Type
            </Text>

            <View style={styles.serviceTypes}>
                {SERVICE_TYPES.map((type) => {
                    const isSelected =
                        serviceType === type;

                    return (
                        <Pressable
                            key={type}
                            style={[
                                styles.typeChip,
                                isSelected &&
                                    styles.selectedTypeChip,
                            ]}
                            onPress={() =>
                                setServiceType(type)
                            }
                            disabled={isSaving}
                        >
                            <Text
                                style={[
                                    styles.typeText,
                                    isSelected &&
                                        styles.selectedTypeText,
                                ]}
                            >
                                {type}
                            </Text>
                        </Pressable>
                    );
                })}
            </View>

            <Text style={styles.label}>
                Service Date
            </Text>

            <Pressable
                style={styles.dateButton}
                onPress={onOpenDatePicker}
                disabled={isSaving}
            >
                <View style={styles.dateContent}>
                    <Ionicons
                        name="calendar-outline"
                        size={22}
                        color="#FF7A00"
                    />

                    <Text style={styles.dateText}>
                        {serviceDate}
                    </Text>
                </View>

                <Ionicons
                    name="chevron-down"
                    size={20}
                    color="#FF7A00"
                />
            </Pressable>

            <Text style={styles.label}>
                Mileage (km)
            </Text>

            <TextInput
                style={styles.input}
                placeholder="Vehicle mileage"
                placeholderTextColor="#6B7280"
                keyboardType="default"
                value={mileage}
                onChangeText={setMileage}
                editable={!isSaving}
            />

            <Text style={styles.label}>
                Cost
            </Text>

            <TextInput
                style={styles.input}
                placeholder="e.g. 250.00"
                placeholderTextColor="#6B7280"
                keyboardType="default"
                value={cost}
                onChangeText={setCost}
                editable={!isSaving}
            />

            <Text style={styles.label}>
                Notes (Optional)
            </Text>

            <TextInput
                style={[
                    styles.input,
                    styles.notesInput,
                ]}
                placeholder="What was done?"
                placeholderTextColor="#6B7280"
                multiline
                value={notes}
                onChangeText={setNotes}
                editable={!isSaving}
            />

            <Pressable
                style={[
                    styles.saveButton,
                    isSaving && styles.disabledButton,
                ]}
                onPress={onSave}
                disabled={isSaving}
            >
                {isSaving ? (
                    <ActivityIndicator
                        color="#FFFFFF"
                    />
                ) : (
                    <>
                        <Ionicons
                            name={
                                isEditMode
                                    ? 'checkmark-circle-outline'
                                    : 'save-outline'
                            }
                            size={22}
                            color="#FFFFFF"
                        />

                        <Text style={styles.saveButtonText}>
                            {isEditMode
                                ? 'Save Changes'
                                : 'Save Service'}
                        </Text>
                    </>
                )}
            </Pressable>
            <Pressable
                style={styles.cancelButton}
                onPress={onCancel}
                disabled={isSaving}
            >
                <Text style={styles.cancelButtonText}>
                    Cancel
                </Text>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    formCard: {
        backgroundColor: '#1C212B',
        borderRadius: 20,
        padding: 20,
        marginBottom: 24,
        borderWidth: 1,
        borderColor: '#303641',
    },

    formHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 24,
    },

    formTitle: {
        color: '#FFFFFF',
        fontSize: 21,
        fontWeight: 'bold',
        marginBottom: 5,
    },

    formSubtitle: {
        color: '#9CA3AF',
        fontSize: 13,
    },

    closeIconButton: {
        backgroundColor: '#292F3A',
        width: 36,
        height: 36,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },

    label: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 9,
    },

    input: {
        backgroundColor: '#0F1117',
        color: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#303641',
        borderRadius: 12,
        padding: 14,
        fontSize: 15,
        marginBottom: 18,
    },

    notesInput: {
        minHeight: 95,
        textAlignVertical: 'top',
    },

    serviceTypes: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 9,
        marginBottom: 22,
    },

    typeChip: {
        backgroundColor: '#252B36',
        borderRadius: 10,
        paddingHorizontal: 12,
        paddingVertical: 10,
        borderWidth: 1,
        borderColor: 'transparent',
    },

    selectedTypeChip: {
        backgroundColor: '#332519',
        borderColor: '#FF7A00',
    },

    typeText: {
        color: '#9CA3AF',
        fontSize: 13,
    },

    selectedTypeText: {
        color: '#FF7A00',
        fontWeight: 'bold',
    },

    dateButton: {
        backgroundColor: '#0F1117',
        borderWidth: 1,
        borderColor: '#303641',
        borderRadius: 12,
        paddingHorizontal: 14,
        height: 54,
        marginBottom: 18,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },

    dateContent: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },

    dateText: {
        color: '#FFFFFF',
        fontSize: 15,
        fontWeight: '500',
    },

    saveButton: {
        backgroundColor: '#FF7A00',
        borderRadius: 12,
        padding: 16,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 10,
    },

    saveButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
    },

    disabledButton: {
        opacity: 0.6,
    },

    cancelButton: {
        backgroundColor: '#303641',
        borderRadius: 12,
        paddingVertical: 15,
        alignItems: 'center',
        marginTop: 12,
    },

    cancelButtonText: {
        color: '#FFFFFF',
        fontSize: 15,
        fontWeight: 'bold',
    },
});