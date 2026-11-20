import {
    useState,
    useEffect,
    useCallback,
    useRef,
} from 'react';

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

const SERVICE_TYPES = [
    'Oil Change',
    'Filters',
    'Brakes',
    'Tires',
    'Inspection',
    'Other',
];

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
    if (!dateString) {
        return new Date();
    }

    const [year, month, day] = dateString
        .split('-')
        .map(Number);

    const date = new Date(
        year,
        month - 1,
        day
    );

    return Number.isNaN(date.getTime())
        ? new Date()
        : date;
}

export default function ServicesScreen() {
    const { user } = useAuth();
    const { vehicles } = useVehicles();

    const [selectedVehicleId, setSelectedVehicleId] =
        useState(null);

    const [records, setRecords] = useState([]);

    const [isLoading, setIsLoading] = useState(false);
    const [isRefreshing, setIsRefreshing] =
        useState(false);

    const [isSaving, setIsSaving] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const [showForm, setShowForm] = useState(false);

    const [editingRecordId, setEditingRecordId] =
        useState(null);

    const [serviceType, setServiceType] =
        useState('Oil Change');

    const [serviceDate, setServiceDate] = useState(
        formatDate(new Date())
    );

    const [mileage, setMileage] = useState('');
    const [cost, setCost] = useState('');
    const [notes, setNotes] = useState('');

    const [showIosDatePicker, setShowIosDatePicker] =
        useState(false);

    const [temporaryDate, setTemporaryDate] =
        useState(new Date());

    const latestRequestId = useRef(0);

    const selectedVehicle = vehicles.find(
        (vehicle) => vehicle.id === selectedVehicleId
    );

    const isEditMode = Boolean(editingRecordId);

    useEffect(() => {
        if (vehicles.length === 0) {
            setSelectedVehicleId(null);
            return;
        }

        const vehicleExists = vehicles.some(
            (vehicle) =>
                vehicle.id === selectedVehicleId
        );

        if (!vehicleExists) {
            setSelectedVehicleId(vehicles[0].id);
        }
    }, [vehicles, selectedVehicleId]);

    const loadRecords = useCallback(
        async (refresh = false) => {
            const requestId =
                ++latestRequestId.current;

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

                if (
                    requestId === latestRequestId.current
                ) {
                    setRecords(data);
                }
            } catch (error) {
                if (
                    requestId === latestRequestId.current
                ) {
                    Alert.alert(
                        'Error',
                        error.message ||
                            'Unable to load service history.'
                    );
                }
            } finally {
                if (
                    requestId === latestRequestId.current
                ) {
                    setIsLoading(false);
                    setIsRefreshing(false);
                }
            }
        },
        [user?.id, selectedVehicleId]
    );

    useEffect(() => {
        loadRecords();

        return () => {
            latestRequestId.current += 1;
        };
    }, [loadRecords]);

    function resetForm() {
        setEditingRecordId(null);

        setServiceType('Oil Change');

        setServiceDate(
            formatDate(new Date())
        );

        setMileage('');
        setCost('');
        setNotes('');
    }

    function openFormHandler() {
        resetForm();

        if (selectedVehicle) {
            setMileage(
                String(selectedVehicle.mileage ?? '')
            );
        }

        setShowForm(true);
    }

    function editRecordHandler(record) {
        Keyboard.dismiss();

        setEditingRecordId(record.id);

        setServiceType(record.service_type);
        setServiceDate(record.service_date);

        setMileage(String(record.mileage));
        setCost(String(record.cost ?? '0'));
        setNotes(record.notes ?? '');

        setShowForm(true);
    }

    function closeFormHandler() {
        if (isSaving) {
            return;
        }

        Keyboard.dismiss();

        setShowForm(false);
        setShowIosDatePicker(false);

        resetForm();
    }

    function openDatePickerHandler() {
        Keyboard.dismiss();

        const currentDate = parseDate(serviceDate);

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

    function confirmIosDateHandler() {
        setServiceDate(
            formatDate(temporaryDate)
        );

        setShowIosDatePicker(false);
    }

    function validateForm() {
        if (!SERVICE_TYPES.includes(serviceType)) {
            return 'Please select a service type.';
        }

        const selectedDate = parseDate(serviceDate);

        if (
            formatDate(selectedDate) !== serviceDate
        ) {
            return 'Please select a valid service date.';
        }

        if (
            selectedDate.getTime() >
            new Date().getTime()
        ) {
            return 'Service date cannot be in the future.';
        }

        const mileageValue = mileage.trim();

        if (
            !/^\d+$/.test(mileageValue) ||
            !Number.isSafeInteger(
                Number(mileageValue)
            )
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

    async function saveServiceHandler() {
        if (
            isSaving ||
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

        setIsSaving(true);

        const serviceData = {
            serviceType,
            serviceDate,
            mileage,
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

    function deleteRecordHandler(record) {
        if (isDeleting) {
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

        resetForm();

        setSelectedVehicleId(vehicleId);
    }

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
                        onPress={closeFormHandler}
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
                    onPress={openDatePickerHandler}
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
                    onPress={saveServiceHandler}
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
                    onPress={closeFormHandler}
                    disabled={isSaving}
                >
                    <Text style={styles.cancelButtonText}>
                        Cancel
                    </Text>
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
                </View>

                <View style={styles.recordDivider} />

                <View style={styles.recordDetails}>
                    <View>
                        <Text style={styles.detailLabel}>
                            MILEAGE
                        </Text>

                        <Text style={styles.recordInfo}>
                            {Number(
                                record.mileage
                            ).toLocaleString()} km
                        </Text>
                    </View>

                    <View style={styles.costContainer}>
                        <Text style={styles.detailLabel}>
                            COST
                        </Text>

                        <Text style={styles.recordCost}>
                            {Number(
                                record.cost
                            ).toFixed(2)}
                        </Text>
                    </View>
                </View>

                {!!record.notes && (
                    <Text style={styles.recordNotes}>
                        {record.notes}
                    </Text>
                )}

                <View style={styles.recordActions}>
                    <Pressable
                        style={styles.editButton}
                        onPress={() =>
                            editRecordHandler(record)
                        }
                        disabled={isDeleting || isSaving}
                    >
                        <Ionicons
                            name="create-outline"
                            size={19}
                            color="#FF7A00"
                        />

                        <Text style={styles.editButtonText}>
                            Edit
                        </Text>
                    </Pressable>

                    <Pressable
                        style={styles.deleteButton}
                        onPress={() =>
                            deleteRecordHandler(record)
                        }
                        disabled={isDeleting || isSaving}
                    >
                        <Ionicons
                            name="trash-outline"
                            size={19}
                            color="#EF4444"
                        />

                        <Text style={styles.deleteButtonText}>
                            Delete
                        </Text>
                    </Pressable>
                </View>
            </View>
        );
    }

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
                            onChange={(
                                event,
                                selectedDate
                            ) => {
                                if (selectedDate) {
                                    setTemporaryDate(
                                        selectedDate
                                    );
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
                                    disabled={
                                        isSaving ||
                                        isDeleting
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

            {Platform.OS === 'ios' &&
                renderIosDatePicker()}
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
        alignItems: 'center',
    },

    detailLabel: {
        color: '#6B7280',
        fontSize: 10,
        fontWeight: 'bold',
        letterSpacing: 1,
        marginBottom: 6,
    },

    recordInfo: {
        color: '#D1D5DB',
        fontSize: 15,
        fontWeight: '600',
    },

    costContainer: {
        alignItems: 'flex-end',
    },

    recordCost: {
        color: '#FF7A00',
        fontSize: 18,
        fontWeight: 'bold',
    },

    recordNotes: {
        color: '#9CA3AF',
        fontSize: 13,
        lineHeight: 20,
        marginTop: 16,
    },

    recordActions: {
        flexDirection: 'row',
        gap: 12,
        marginTop: 20,
    },

    editButton: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 8,
        backgroundColor: '#332519',
        borderWidth: 1,
        borderColor: '#FF7A00',
        paddingVertical: 12,
        borderRadius: 11,
    },

    editButtonText: {
        color: '#FF7A00',
        fontSize: 14,
        fontWeight: 'bold',
    },

    deleteButton: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 8,
        backgroundColor: '#301F26',
        borderWidth: 1,
        borderColor: '#65303A',
        paddingVertical: 12,
        borderRadius: 11,
    },

    deleteButtonText: {
        color: '#EF4444',
        fontSize: 14,
        fontWeight: 'bold',
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