import { useState, useEffect, useCallback } from 'react';

import {
    View,
    Text,
    TextInput,
    ScrollView,
    Pressable,
    StyleSheet,
    ActivityIndicator,
    Alert,
    RefreshControl,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { useAuth } from '../context/AuthContext';
import { useVehicles } from '../context/VehicleContext';

import {
    getServiceRecords,
    createServiceRecord,
    deleteServiceRecord,
} from '../services/serviceRecordService';

const SERVICE_TYPES = [
    'Oil Change',
    'Filters',
    'Brakes',
    'Tires',
    'Inspection',
    'Other',
];

export default function ServicesScreen() {
    const { user } = useAuth();
    const { vehicles } = useVehicles();

    const [selectedVehicleId, setSelectedVehicleId] =
        useState(null);

    const [records, setRecords] = useState([]);

    const [isLoading, setIsLoading] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    const [showForm, setShowForm] = useState(false);

    const [serviceType, setServiceType] =
        useState('Oil Change');

    const [serviceDate, setServiceDate] = useState(
        new Date().toISOString().slice(0, 10)
    );

    const [mileage, setMileage] = useState('');
    const [cost, setCost] = useState('');
    const [notes, setNotes] = useState('');

    const selectedVehicle = vehicles.find(
        vehicle => vehicle.id === selectedVehicleId
    );

    useEffect(() => {
        if (vehicles.length === 0) {
            setSelectedVehicleId(null);
            return;
        }

        const vehicleExists = vehicles.some(
            vehicle => vehicle.id === selectedVehicleId
        );

        if (!vehicleExists) {
            setSelectedVehicleId(vehicles[0].id);
        }
    }, [vehicles, selectedVehicleId]);

    const loadRecords = useCallback(
        async (refresh = false) => {
            if (!user?.id || !selectedVehicleId) {
                setRecords([]);
                return;
            }

            if (refresh) {
                setIsRefreshing(true);
            } else {
                setIsLoading(true);
            }

            try {
                const data = await getServiceRecords(
                    user.id,
                    selectedVehicleId
                );

                setRecords(data);
            } catch (error) {
                Alert.alert(
                    'Error',
                    error.message ||
                        'Unable to load service history.'
                );
            } finally {
                setIsLoading(false);
                setIsRefreshing(false);
            }
        },
        [user?.id, selectedVehicleId]
    );

    useEffect(() => {
        loadRecords();
    }, [loadRecords]);

    function resetForm() {
        setServiceType('Oil Change');
        setServiceDate(
            new Date().toISOString().slice(0, 10)
        );
        setMileage('');
        setCost('');
        setNotes('');
    }

    function openFormHandler() {
        resetForm();

        if (selectedVehicle) {
            setMileage(String(selectedVehicle.mileage));
        }

        setShowForm(true);
    }

    function closeFormHandler() {
        if (isSaving) {
            return;
        }

        setShowForm(false);
    }

    function validateForm() {
        const datePattern = /^\d{4}-\d{2}-\d{2}$/;

        if (!datePattern.test(serviceDate)) {
            return 'Date must be in YYYY-MM-DD format.';
        }

        const [year, month, day] = serviceDate
            .split('-')
            .map(Number);

        const parsedDate = new Date(
            Date.UTC(year, month - 1, day)
        );

        if (
            parsedDate.getUTCFullYear() !== year ||
            parsedDate.getUTCMonth() !== month - 1 ||
            parsedDate.getUTCDate() !== day
        ) {
            return 'Please enter a valid date.';
        }

        if (
            !/^\d+$/.test(mileage) ||
            !Number.isSafeInteger(Number(mileage))
        ) {
            return 'Mileage must be a valid whole number.';
        }

        const costValue = cost.trim();

        if (
            costValue &&
            (
                !/^\d+(\.\d{1,2})?$/.test(costValue) ||
                !Number.isFinite(Number(costValue))
            )
        ) {
            return 'Cost must be a valid positive amount.';
        }

        return null;
    }

    async function saveServiceHandler() {
        if (isSaving || !selectedVehicleId || !user?.id) {
            return;
        }

        const validationError = validateForm();

        if (validationError) {
            Alert.alert(
                'Validation Error',
                validationError
            );
            return;
        }

        setIsSaving(true);

        try {
            await createServiceRecord(
                user.id,
                selectedVehicleId,
                {
                    serviceType,
                    serviceDate,
                    mileage,
                    cost: cost.trim() || '0',
                    notes,
                }
            );

            setShowForm(false);
            resetForm();

            await loadRecords();
        } catch (error) {
            Alert.alert(
                'Save Error',
                error.message ||
                    'Unable to save service record.'
            );
        } finally {
            setIsSaving(false);
        }
    }

    function deleteRecordHandler(record) {
        Alert.alert(
            'Delete Service',
            'Are you sure you want to delete this service?',
            [
                {
                    text: 'Cancel',
                    style: 'cancel',
                },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await deleteServiceRecord(
                                user.id,
                                record.id
                            );

                            await loadRecords();
                        } catch (error) {
                            Alert.alert(
                                'Delete Error',
                                error.message ||
                                    'Unable to delete service.'
                            );
                        }
                    },
                },
            ]
        );
    }

    function renderVehicleSelector() {
        return (
            <View style={styles.vehicleSelector}>
                {vehicles.map(vehicle => {
                    const isSelected =
                        vehicle.id === selectedVehicleId;

                    return (
                        <Pressable
                            key={vehicle.id}
                            style={[
                                styles.vehicleChip,
                                isSelected &&
                                    styles.selectedVehicleChip,
                            ]}
                            onPress={() =>
                                setSelectedVehicleId(vehicle.id)
                            }
                        >
                            <Ionicons
                                name="car-sport"
                                size={19}
                                color={
                                    isSelected
                                        ? '#FF7A00'
                                        : '#9CA3AF'
                                }
                            />

                            <Text
                                style={[
                                    styles.vehicleChipText,
                                    isSelected &&
                                        styles.selectedVehicleText,
                                ]}
                            >
                                {vehicle.brand} {vehicle.model}
                            </Text>
                        </Pressable>
                    );
                })}
            </View>
        );
    }

    function renderForm() {
        return (
            <View style={styles.formCard}>
                <View style={styles.formHeader}>
                    <Text style={styles.formTitle}>
                        New Service
                    </Text>

                    <Pressable
                        onPress={closeFormHandler}
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
                    Service Type
                </Text>

                <View style={styles.serviceTypes}>
                    {SERVICE_TYPES.map(type => {
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

                <TextInput
                    style={styles.input}
                    placeholder="YYYY-MM-DD"
                    placeholderTextColor="#6B7280"
                    value={serviceDate}
                    onChangeText={setServiceDate}
                />

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
                />

                <Pressable
                    style={[
                        styles.saveButton,
                        isSaving && styles.disabledButton,
                    ]}
                    onPress={saveServiceHandler}
                    disabled={isSaving}
                >
                    {isSaving ? (
                        <ActivityIndicator color="#FFFFFF" />
                    ) : (
                        <>
                            <Ionicons
                                name="checkmark-circle-outline"
                                size={21}
                                color="#FFFFFF"
                            />

                            <Text style={styles.saveButtonText}>
                                Save Service
                            </Text>
                        </>
                    )}
                </Pressable>
            </View>
        );
    }

    function renderRecord(record) {
        return (
            <View
                key={record.id}
                style={styles.recordCard}
            >
                <View style={styles.recordHeader}>
                    <View style={styles.recordIcon}>
                        <Ionicons
                            name="construct-outline"
                            size={24}
                            color="#FF7A00"
                        />
                    </View>

                    <View style={styles.recordTitleContainer}>
                        <Text style={styles.recordTitle}>
                            {record.service_type}
                        </Text>

                        <Text style={styles.recordDate}>
                            {record.service_date}
                        </Text>
                    </View>

                    <Pressable
                        onPress={() =>
                            deleteRecordHandler(record)
                        }
                        hitSlop={10}
                    >
                        <Ionicons
                            name="trash-outline"
                            size={21}
                            color="#EF4444"
                        />
                    </Pressable>
                </View>

                <View style={styles.recordDivider} />

                <View style={styles.recordDetails}>
                    <Text style={styles.recordInfo}>
                        {Number(record.mileage).toLocaleString()} km
                    </Text>

                    <Text style={styles.recordCost}>
                        {Number(record.cost).toFixed(2)}
                    </Text>
                </View>

                {!!record.notes && (
                    <Text style={styles.recordNotes}>
                        {record.notes}
                    </Text>
                )}
            </View>
        );
    }

    return (
        <SafeAreaView
            style={styles.safeArea}
            edges={['top', 'left', 'right']}
        >
            <KeyboardAvoidingView
                style={styles.flex}
                behavior={
                    Platform.OS === 'ios'
                        ? 'padding'
                        : undefined
                }
            >
                <ScrollView
                    contentContainerStyle={styles.content}
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                    refreshControl={
                        <RefreshControl
                            refreshing={isRefreshing}
                            onRefresh={() =>
                                loadRecords(true)
                            }
                            tintColor="#FF7A00"
                        />
                    }
                >
                    <View style={styles.pageHeader}>
                        <View>
                            <Text style={styles.eyebrow}>
                                AUTOCARE MAINTENANCE
                            </Text>

                            <Text style={styles.pageTitle}>
                                Services
                            </Text>

                            <Text style={styles.subtitle}>
                                Track every service,
                                keep every mile.
                            </Text>
                        </View>

                        <Ionicons
                            name="build-outline"
                            size={34}
                            color="#FF7A00"
                        />
                    </View>

                    {vehicles.length === 0 ? (
                        <View style={styles.emptyCard}>
                            <Ionicons
                                name="car-sport-outline"
                                size={52}
                                color="#FF7A00"
                            />

                            <Text style={styles.emptyTitle}>
                                No vehicles yet
                            </Text>

                            <Text style={styles.emptyText}>
                                Add a vehicle in My Garage
                                to start tracking services.
                            </Text>
                        </View>
                    ) : (
                        <>
                            <Text style={styles.sectionTitle}>
                                Select Vehicle
                            </Text>

                            {renderVehicleSelector()}

                            <View style={styles.historyHeader}>
                                <Text style={styles.sectionTitle}>
                                    Service History
                                </Text>

                                <Text style={styles.recordCount}>
                                    {records.length} records
                                </Text>
                            </View>

                            {!showForm && (
                                <Pressable
                                    style={styles.addButton}
                                    onPress={openFormHandler}
                                >
                                    <Ionicons
                                        name="add-circle-outline"
                                        size={23}
                                        color="#FFFFFF"
                                    />

                                    <Text style={styles.addButtonText}>
                                        Add Service
                                    </Text>
                                </Pressable>
                            )}

                            {showForm && renderForm()}

                            {isLoading ? (
                                <ActivityIndicator
                                    size="large"
                                    color="#FF7A00"
                                    style={styles.loader}
                                />
                            ) : records.length === 0 ? (
                                <View style={styles.emptyCard}>
                                    <Ionicons
                                        name="document-text-outline"
                                        size={44}
                                        color="#FF7A00"
                                    />

                                    <Text style={styles.emptyTitle}>
                                        No service records
                                    </Text>

                                    <Text style={styles.emptyText}>
                                        Add your first maintenance
                                        record for this vehicle.
                                    </Text>
                                </View>
                            ) : (
                                records.map(renderRecord)
                            )}
                        </>
                    )}
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    flex: {
        flex: 1,
    },

    safeArea: {
        flex: 1,
        backgroundColor: '#0F1117',
    },

    content: {
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 40,
    },

    pageHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 32,
    },

    eyebrow: {
        color: '#FF7A00',
        fontSize: 11,
        letterSpacing: 2,
        fontWeight: 'bold',
        marginBottom: 9,
    },

    pageTitle: {
        color: '#FFFFFF',
        fontSize: 34,
        fontWeight: 'bold',
    },

    subtitle: {
        color: '#9CA3AF',
        fontSize: 13,
        marginTop: 8,
    },

    sectionTitle: {
        color: '#FFFFFF',
        fontSize: 19,
        fontWeight: 'bold',
        marginBottom: 15,
    },

    vehicleSelector: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
        marginBottom: 32,
    },

    vehicleChip: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        paddingHorizontal: 14,
        paddingVertical: 12,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#303641',
        backgroundColor: '#1C212B',
    },

    selectedVehicleChip: {
        borderColor: '#FF7A00',
        backgroundColor: '#332519',
    },

    vehicleChipText: {
        color: '#9CA3AF',
        fontSize: 13,
        fontWeight: 'bold',
    },

    selectedVehicleText: {
        color: '#FF7A00',
    },

    historyHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },

    recordCount: {
        color: '#9CA3AF',
        fontSize: 13,
    },

    addButton: {
        backgroundColor: '#FF7A00',
        borderRadius: 14,
        padding: 16,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 10,
        marginBottom: 24,
    },

    addButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
    },

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
        alignItems: 'center',
        marginBottom: 20,
    },

    formTitle: {
        color: '#FFFFFF',
        fontSize: 21,
        fontWeight: 'bold',
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

    recordCard: {
        backgroundColor: '#1C212B',
        borderRadius: 18,
        padding: 18,
        borderWidth: 1,
        borderColor: '#303641',
        marginBottom: 14,
    },

    recordHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },

    recordIcon: {
        width: 46,
        height: 46,
        borderRadius: 13,
        backgroundColor: '#332519',
        justifyContent: 'center',
        alignItems: 'center',
    },

    recordTitleContainer: {
        flex: 1,
    },

    recordTitle: {
        color: '#FFFFFF',
        fontSize: 17,
        fontWeight: 'bold',
        marginBottom: 5,
    },

    recordDate: {
        color: '#9CA3AF',
        fontSize: 13,
    },

    recordDivider: {
        height: 1,
        backgroundColor: '#303641',
        marginVertical: 15,
    },

    recordDetails: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },

    recordInfo: {
        color: '#D1D5DB',
        fontSize: 14,
    },

    recordCost: {
        color: '#FF7A00',
        fontSize: 16,
        fontWeight: 'bold',
    },

    recordNotes: {
        color: '#9CA3AF',
        fontSize: 13,
        lineHeight: 20,
        marginTop: 14,
    },

    emptyCard: {
        backgroundColor: '#1C212B',
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#303641',
        padding: 30,
        alignItems: 'center',
        gap: 12,
        marginTop: 12,
    },

    emptyTitle: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: 'bold',
    },

    emptyText: {
        color: '#9CA3AF',
        fontSize: 14,
        textAlign: 'center',
        lineHeight: 21,
    },

    loader: {
        marginVertical: 35,
    },
});