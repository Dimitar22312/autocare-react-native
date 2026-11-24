import {
    useState,
    useEffect,
    useCallback,
    useRef,
} from 'react';

import {
    View,
    Text,
    ScrollView,
    Pressable,
    StyleSheet,
    ActivityIndicator,
    Alert,
    RefreshControl,
    KeyboardAvoidingView,
    Keyboard,
    Platform,
    Modal,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import DateTimePicker, {
    DateTimePickerAndroid,
} from '@react-native-community/datetimepicker';

import { useAuth } from '../context/AuthContext';
import { useVehicles } from '../context/VehicleContext';

import {
    getServiceRecords,
    createServiceRecord,
    updateServiceRecord,
    deleteServiceRecord,
} from '../services/serviceRecordService';

import MaintenanceStats from '../components/MaintenanceStats';

import ServiceCard from '../components/services/ServiceCard';
import ServiceForm from '../components/services/ServiceForm';


// --------------------------------------------------
// Constants
// --------------------------------------------------

const SERVICE_TYPES = [
    'Oil Change',
    'Filters',
    'Brakes',
    'Tires',
    'Inspection',
    'Other',
];


// --------------------------------------------------
// Date Helpers
// --------------------------------------------------

function formatDate(date) {
    const year = date.getFullYear();

    const month = String(
        date.getMonth() + 1
    ).padStart(2, '0');

    const day = String(
        date.getDate()
    ).padStart(2, '0');

    return `${year}-${month}-${day}`;
}

function parseDate(dateString) {
    if (
        typeof dateString !== 'string' ||
        !/^\d{4}-\d{2}-\d{2}$/.test(dateString)
    ) {
        return null;
    }

    const [year, month, day] = dateString
        .split('-')
        .map(Number);

    const date = new Date(year, month - 1, day);

    if (
        date.getFullYear() !== year ||
        date.getMonth() !== month - 1 ||
        date.getDate() !== day
    ) {
        return null;
    }

    return date;
}


// --------------------------------------------------
// Services Screen
// --------------------------------------------------

export default function ServicesScreen() {
    const { user } = useAuth();
    const { vehicles } = useVehicles();

    // Vehicle State

    const [
        selectedVehicleId,
        setSelectedVehicleId,
    ] = useState(null);

    const selectedVehicle = vehicles.find(
        (vehicle) => vehicle.id === selectedVehicleId
    );

    // Records State

    const [records, setRecords] = useState([]);

    const [isLoading, setIsLoading] = useState(false);

    const [isRefreshing, setIsRefreshing] = useState(false);

    const [isSaving, setIsSaving] = useState(false);

    const [isDeleting, setIsDeleting] = useState(false);

    const latestRequestId = useRef(0);

    // Form State

    const [showForm, setShowForm] = useState(false);

    const [
        editingRecordId,
        setEditingRecordId,
    ] = useState(null);

    const [serviceType, setServiceType] = useState(
        'Oil Change'
    );

    const [serviceDate, setServiceDate] = useState(
        formatDate(new Date())
    );

    const [mileage, setMileage] = useState('');

    const [cost, setCost] = useState('');

    const [notes, setNotes] = useState('');

    const isEditMode = Boolean(editingRecordId);

    // Date Picker State

    const [
        showIosDatePicker,
        setShowIosDatePicker,
    ] = useState(false);

    const [
        temporaryDate,
        setTemporaryDate,
    ] = useState(new Date());


    // --------------------------------------------------
    // Automatically Select Vehicle
    // --------------------------------------------------

    useEffect(() => {
        if (vehicles.length === 0) {
            setSelectedVehicleId(null);
            return;
        }

        const vehicleExists = vehicles.some(
            (vehicle) => vehicle.id === selectedVehicleId
        );

        if (!vehicleExists) {
            setSelectedVehicleId(vehicles[0].id);
        }
    }, [vehicles, selectedVehicleId]);


    // --------------------------------------------------
    // Load Service Records
    // --------------------------------------------------

    const loadRecords = useCallback(
        async (refresh = false) => {
            const requestId = ++latestRequestId.current;

            if (!user?.id || !selectedVehicleId) {
                setRecords([]);
                setIsLoading(false);
                setIsRefreshing(false);
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

                if (requestId === latestRequestId.current) {
                    setRecords(data ?? []);
                }
            } catch (error) {
                if (requestId === latestRequestId.current) {
                    Alert.alert(
                        'Error',
                        error.message ||
                            'Unable to load service history.'
                    );
                }
            } finally {
                if (requestId === latestRequestId.current) {
                    setIsLoading(false);
                    setIsRefreshing(false);
                }
            }
        },
        [user?.id, selectedVehicleId]
    );


    // --------------------------------------------------
    // Initial Load
    // --------------------------------------------------

    useEffect(() => {
        loadRecords();

        return () => {
            latestRequestId.current += 1;
        };
    }, [loadRecords]);


    // --------------------------------------------------
    // Reset Form
    // --------------------------------------------------

    function resetForm() {
        setEditingRecordId(null);
        setServiceType('Oil Change');
        setServiceDate(formatDate(new Date()));
        setMileage('');
        setCost('');
        setNotes('');
    }


    // --------------------------------------------------
    // Open Add Form
    // --------------------------------------------------

    function openFormHandler() {
        if (!selectedVehicle || isSaving || isDeleting) {
            return;
        }

        resetForm();

        setMileage(
            String(selectedVehicle.mileage ?? '')
        );

        setShowForm(true);
    }


    // --------------------------------------------------
    // Open Edit Form
    // --------------------------------------------------

    function editRecordHandler(record) {
        if (isSaving || isDeleting) {
            return;
        }

        Keyboard.dismiss();

        setEditingRecordId(record.id);
        setServiceType(record.service_type);
        setServiceDate(record.service_date);
        setMileage(String(record.mileage ?? ''));
        setCost(String(record.cost ?? '0'));
        setNotes(record.notes ?? '');

        setShowForm(true);
    }


    // --------------------------------------------------
    // Close Form
    // --------------------------------------------------

    function closeFormHandler() {
        if (isSaving) {
            return;
        }

        Keyboard.dismiss();

        setShowForm(false);
        setShowIosDatePicker(false);

        resetForm();
    }


    // --------------------------------------------------
    // Open Native Date Picker
    // --------------------------------------------------

    function openDatePickerHandler() {
        Keyboard.dismiss();

        const currentDate =
            parseDate(serviceDate) ?? new Date();

        if (Platform.OS === 'android') {
            DateTimePickerAndroid.open({
                value: currentDate,
                mode: 'date',
                maximumDate: new Date(),

                onChange: (event, selectedDate) => {
                    if (
                        event.type === 'set' &&
                        selectedDate
                    ) {
                        setServiceDate(
                            formatDate(selectedDate)
                        );
                    }
                },
            });

            return;
        }

        setTemporaryDate(currentDate);
        setShowIosDatePicker(true);
    }


    // --------------------------------------------------
    // Confirm iOS Date
    // --------------------------------------------------

    function confirmIosDateHandler() {
        setServiceDate(formatDate(temporaryDate));
        setShowIosDatePicker(false);
    }


    // --------------------------------------------------
    // Validate Form
    // --------------------------------------------------

    function validateForm() {
        if (!SERVICE_TYPES.includes(serviceType)) {
            return 'Please select a service type.';
        }

        const selectedDate = parseDate(serviceDate);

        if (!selectedDate) {
            return 'Please select a valid service date.';
        }

        const today = new Date();

        today.setHours(0, 0, 0, 0);

        if (selectedDate > today) {
            return 'Service date cannot be in the future.';
        }

        const mileageValue = mileage.trim();

        if (
            !/^\d+$/.test(mileageValue) ||
            !Number.isSafeInteger(Number(mileageValue))
        ) {
            return 'Mileage must be a non-negative whole number.';
        }

        const costValue = cost.trim();

        if (
            costValue &&
            (
                !/^\d+(\.\d{1,2})?$/.test(costValue) ||
                !Number.isFinite(Number(costValue)) ||
                Number(costValue) > 99999999.99
            )
        ) {
            return 'Enter a valid cost with up to 2 decimal places.';
        }

        return null;
    }


    // --------------------------------------------------
    // Create / Update Service
    // --------------------------------------------------

    async function saveServiceHandler() {
        if (
            isSaving ||
            isDeleting ||
            !selectedVehicleId ||
            !user?.id
        ) {
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

        Keyboard.dismiss();

        setIsSaving(true);

        const serviceData = {
            serviceType,
            serviceDate,
            mileage: mileage.trim(),
            cost: cost.trim() || '0',
            notes,
        };

        try {
            if (isEditMode) {
                await updateServiceRecord(
                    user.id,
                    editingRecordId,
                    serviceData
                );
            } else {
                await createServiceRecord(
                    user.id,
                    selectedVehicleId,
                    serviceData
                );
            }

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


    // --------------------------------------------------
    // Delete Service
    // --------------------------------------------------

    function deleteRecordHandler(record) {
        if (
            isDeleting ||
            isSaving ||
            !user?.id
        ) {
            return;
        }

        Alert.alert(
            'Delete Service',
            'Are you sure you want to delete this service record?',
            [
                {
                    text: 'Cancel',
                    style: 'cancel',
                },
                {
                    text: 'Delete',
                    style: 'destructive',

                    onPress: async () => {
                        if (!user?.id) {
                            return;
                        }

                        setIsDeleting(true);

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
                        } finally {
                            setIsDeleting(false);
                        }
                    },
                },
            ]
        );
    }


    // --------------------------------------------------
    // Select Vehicle
    // --------------------------------------------------

    function selectVehicleHandler(vehicleId) {
        if (
            isSaving ||
            isDeleting ||
            vehicleId === selectedVehicleId
        ) {
            return;
        }

        setRecords([]);
        setShowForm(false);
        setShowIosDatePicker(false);

        resetForm();

        setSelectedVehicleId(vehicleId);
    }


    // --------------------------------------------------
    // Vehicle Selector
    // --------------------------------------------------

    function renderVehicleSelector() {
        return (
            <View style={styles.vehicleSelector}>
                {vehicles.map((vehicle) => {
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
                                selectVehicleHandler(vehicle.id)
                            }
                            disabled={isSaving || isDeleting}
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


    // --------------------------------------------------
    // iOS Date Picker
    // --------------------------------------------------

    function renderIosDatePicker() {
        return (
            <Modal
                visible={showIosDatePicker}
                transparent
                animationType="fade"
                onRequestClose={() =>
                    setShowIosDatePicker(false)
                }
            >
                <View style={styles.dateModalOverlay}>
                    <View style={styles.dateModalContent}>
                        <View style={styles.dateModalHeader}>
                            <Text style={styles.dateModalTitle}>
                                Select Service Date
                            </Text>

                            <Pressable
                                onPress={() =>
                                    setShowIosDatePicker(false)
                                }
                            >
                                <Ionicons
                                    name="close"
                                    size={24}
                                    color="#9CA3AF"
                                />
                            </Pressable>
                        </View>

                        <DateTimePicker
                            value={temporaryDate}
                            mode="date"
                            display="spinner"
                            themeVariant="dark"
                            textColor="#FFFFFF"
                            maximumDate={new Date()}
                            onChange={(event, selectedDate) => {
                                if (selectedDate) {
                                    setTemporaryDate(selectedDate);
                                }
                            }}
                            style={styles.iosDatePicker}
                        />

                        <Pressable
                            style={styles.confirmDateButton}
                            onPress={confirmIosDateHandler}
                        >
                            <Text style={styles.confirmDateText}>
                                Confirm Date
                            </Text>
                        </Pressable>
                    </View>
                </View>
            </Modal>
        );
    }


    // --------------------------------------------------
    // Main Render
    // --------------------------------------------------

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
                            onRefresh={() => loadRecords(true)}
                            tintColor="#FF7A00"
                        />
                    }
                >
                    {/* Header */}

                    <View style={styles.pageHeader}>
                        <View style={styles.headerText}>
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
                        // No Vehicles

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
                            {/* Vehicle Selection */}

                            <Text style={styles.sectionTitle}>
                                Select Vehicle
                            </Text>

                            {renderVehicleSelector()}

                            {/* Maintenance Statistics */}

                            {!isLoading && (
                                <MaintenanceStats
                                    records={records}
                                />
                            )}

                            {/* Service History Header */}

                            <View style={styles.historyHeader}>
                                <Text style={styles.sectionTitle}>
                                    Service History
                                </Text>

                                <Text style={styles.recordCount}>
                                    {`${records.length} record${
                                        records.length === 1 ? '' : 's'
                                    }`}
                                </Text>
                            </View>

                            {/* Add Service */}

                            {!showForm && (
                                <Pressable
                                    style={[
                                        styles.addButton,
                                        (isSaving || isDeleting) &&
                                            styles.disabledButton,
                                    ]}
                                    onPress={openFormHandler}
                                    disabled={
                                        isSaving || isDeleting
                                    }
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

                            {/* Service Form Component */}

                            {showForm && (
                                <ServiceForm
                                    isEditMode={isEditMode}
                                    serviceType={serviceType}
                                    setServiceType={setServiceType}
                                    serviceDate={serviceDate}
                                    mileage={mileage}
                                    setMileage={setMileage}
                                    cost={cost}
                                    setCost={setCost}
                                    notes={notes}
                                    setNotes={setNotes}
                                    isSaving={isSaving}
                                    onOpenDatePicker={
                                        openDatePickerHandler
                                    }
                                    onSave={saveServiceHandler}
                                    onCancel={closeFormHandler}
                                />
                            )}

                            {/* Service History */}

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
                                records.map((record) => (
                                    <ServiceCard
                                        key={record.id}
                                        record={record}
                                        onEdit={() =>
                                            editRecordHandler(record)
                                        }
                                        onDelete={() =>
                                            deleteRecordHandler(record)
                                        }
                                        disabled={
                                            isSaving || isDeleting
                                        }
                                    />
                                ))
                            )}
                        </>
                    )}
                </ScrollView>
            </KeyboardAvoidingView>

            {/* Native iOS Date Picker */}

            {Platform.OS === 'ios' &&
                renderIosDatePicker()}
        </SafeAreaView>
    );
}


// --------------------------------------------------
// Styles
// --------------------------------------------------

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

    headerText: {
        flex: 1,
        paddingRight: 12,
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

    // Vehicle Selector

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

    // Service History

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

    disabledButton: {
        opacity: 0.6,
    },

    // Empty States

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

    // iOS Date Picker

    dateModalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
        justifyContent: 'center',
        paddingHorizontal: 24,
    },

    dateModalContent: {
        backgroundColor: '#1C212B',
        borderRadius: 24,
        borderWidth: 1,
        borderColor: '#303641',
        padding: 20,
    },

    dateModalHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 12,
    },

    dateModalTitle: {
        color: '#FFFFFF',
        fontSize: 19,
        fontWeight: 'bold',
    },

    iosDatePicker: {
        height: 180,
        width: '100%',
    },

    confirmDateButton: {
        backgroundColor: '#FF7A00',
        borderRadius: 12,
        paddingVertical: 15,
        alignItems: 'center',
        marginTop: 14,
    },

    confirmDateText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
});