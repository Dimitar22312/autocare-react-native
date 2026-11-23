import {
    useEffect,
    useState,
} from 'react';

import {
    View,
    Text,
    TextInput,
    Pressable,
    StyleSheet,
    ActivityIndicator,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';

function isValidDate(value) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
        return false;
    }

    const [year, month, day] = value
        .split('-')
        .map(Number);

    const date = new Date(
        Date.UTC(year, month - 1, day)
    );

    return (
        date.getUTCFullYear() === year &&
        date.getUTCMonth() === month - 1 &&
        date.getUTCDate() === day
    );
}

export default function ReminderForm({
    vehicles,
    reminderToEdit,
    onSave,
    onCancel,
    isSaving,
}) {
    const [vehicleId, setVehicleId] = useState('');
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [dueDate, setDueDate] = useState('');

    const [errors, setErrors] = useState({});

    const isEditMode = Boolean(reminderToEdit);

    useEffect(() => {
        setVehicleId(
            reminderToEdit?.vehicle_id ??
                vehicles[0]?.id ??
                ''
        );

        setTitle(reminderToEdit?.title ?? '');

        setDescription(
            reminderToEdit?.description ?? ''
        );

        setDueDate(reminderToEdit?.due_date ?? '');

        setErrors({});
    }, [reminderToEdit, vehicles]);

    function saveHandler() {
        const validationErrors = {};

        if (!vehicleId) {
            validationErrors.vehicleId =
                'Please select a vehicle.';
        }

        if (title.trim().length < 2) {
            validationErrors.title =
                'Title must contain at least 2 characters.';
        } else if (title.trim().length > 100) {
            validationErrors.title =
                'Title must be 100 characters or fewer.';
        }

        if (!isValidDate(dueDate.trim())) {
            validationErrors.dueDate =
                'Enter a valid date (YYYY-MM-DD).';
        }

        if (
            Object.keys(validationErrors).length > 0
        ) {
            setErrors(validationErrors);
            return;
        }

        setErrors({});

        onSave({
            vehicleId,
            title,
            description,
            dueDate: dueDate.trim(),
        });
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>
                    {isEditMode
                        ? 'Edit Reminder'
                        : 'New Reminder'}
                </Text>

                <Pressable
                    onPress={onCancel}
                    disabled={isSaving}
                >
                    <Ionicons
                        name="close"
                        size={25}
                        color="#9CA3AF"
                    />
                </Pressable>
            </View>

            <Text style={styles.label}>
                Select Vehicle
            </Text>

            <View style={styles.vehicleSelector}>
                {vehicles.map((vehicle) => {
                    const selected =
                        vehicleId === vehicle.id;

                    return (
                        <Pressable
                            key={vehicle.id}
                            style={[
                                styles.vehicleChip,
                                selected &&
                                    styles.selectedChip,
                            ]}
                            onPress={() =>
                                setVehicleId(vehicle.id)
                            }
                            disabled={isSaving}
                        >
                            <Text
                                style={[
                                    styles.vehicleText,
                                    selected &&
                                        styles.selectedText,
                                ]}
                            >
                                {vehicle.brand} {vehicle.model}
                            </Text>
                        </Pressable>
                    );
                })}
            </View>

            {!!errors.vehicleId && (
                <Text style={styles.errorText}>
                    {errors.vehicleId}
                </Text>
            )}

            <Text style={styles.label}>
                Reminder Title
            </Text>

            <TextInput
                style={styles.input}
                placeholder="e.g. Annual Inspection"
                placeholderTextColor="#6B7280"
                value={title}
                onChangeText={setTitle}
                editable={!isSaving}
                maxLength={100}
            />

            {!!errors.title && (
                <Text style={styles.errorText}>
                    {errors.title}
                </Text>
            )}

            <Text style={styles.label}>
                Due Date
            </Text>

            <TextInput
                style={styles.input}
                placeholder="YYYY-MM-DD"
                placeholderTextColor="#6B7280"
                value={dueDate}
                onChangeText={setDueDate}
                editable={!isSaving}
                maxLength={10}
            />

            {!!errors.dueDate && (
                <Text style={styles.errorText}>
                    {errors.dueDate}
                </Text>
            )}

            <Text style={styles.label}>
                Description (Optional)
            </Text>

            <TextInput
                style={[
                    styles.input,
                    styles.descriptionInput,
                ]}
                placeholder="Additional details..."
                placeholderTextColor="#6B7280"
                value={description}
                onChangeText={setDescription}
                editable={!isSaving}
                multiline
            />

            <Pressable
                style={[
                    styles.saveButton,
                    isSaving && styles.disabledButton,
                ]}
                onPress={saveHandler}
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
                            {isEditMode
                                ? 'Save Changes'
                                : 'Create Reminder'}
                        </Text>
                    </>
                )}
            </Pressable>

            <Pressable
                style={styles.cancelButton}
                onPress={onCancel}
                disabled={isSaving}
            >
                <Text style={styles.cancelText}>
                    Cancel
                </Text>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#1C212B',
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#303641',
        padding: 20,
        marginBottom: 25,
    },

    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 24,
    },

    title: {
        color: '#FFFFFF',
        fontSize: 21,
        fontWeight: 'bold',
    },

    label: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 10,
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

    descriptionInput: {
        minHeight: 95,
        textAlignVertical: 'top',
    },

    vehicleSelector: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 9,
        marginBottom: 20,
    },

    vehicleChip: {
        backgroundColor: '#252B36',
        borderWidth: 1,
        borderColor: '#303641',
        borderRadius: 10,
        paddingHorizontal: 12,
        paddingVertical: 10,
    },

    selectedChip: {
        backgroundColor: '#332519',
        borderColor: '#FF7A00',
    },

    vehicleText: {
        color: '#9CA3AF',
        fontSize: 13,
    },

    selectedText: {
        color: '#FF7A00',
        fontWeight: 'bold',
    },

    errorText: {
        color: '#F87171',
        fontSize: 12,
        marginTop: -10,
        marginBottom: 15,
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
        fontSize: 15,
        fontWeight: 'bold',
    },

    disabledButton: {
        opacity: 0.6,
    },

    cancelButton: {
        backgroundColor: '#303641',
        borderRadius: 12,
        padding: 15,
        alignItems: 'center',
        marginTop: 12,
    },

    cancelText: {
        color: '#FFFFFF',
        fontSize: 15,
        fontWeight: 'bold',
    },
});