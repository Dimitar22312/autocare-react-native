import { useState, useEffect } from 'react';

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
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { useAuth } from '../context/AuthContext';
import { useVehicles } from '../context/VehicleContext';

import MaintenanceStats from '../components/MaintenanceStats';
import ServiceCard from '../components/services/ServiceCard';
import ServiceForm from '../components/services/ServiceForm';
import ServiceDatePicker, {
    openAndroidDatePicker,
} from '../components/services/ServiceDatePicker';
import VehicleSelector from '../components/services/VehicleSelector';

import useServiceRecords from '../hooks/useServiceRecords';

import { formatServiceDate } from '../utils/serviceDate';


import { validateServiceRecord } from '../utils/serviceValidation';

export default function ServicesScreen() {
    const { user } = useAuth();
    const { vehicles } = useVehicles();

    const [
        selectedVehicleId,
        setSelectedVehicleId,
    ] = useState(null);

    const selectedVehicle = vehicles.find(
        (vehicle) => vehicle.id === selectedVehicleId
    );

    const {
        records,
        error,
        isLoading,
        isRefreshing,
        isSaving,
        isDeleting,
        refreshRecords,
        saveRecord,
        removeRecord,
    } = useServiceRecords(
        user?.id,
        selectedVehicleId
    );

    const [showForm, setShowForm] = useState(false);

    const [editingRecordId, setEditingRecordId] = useState(null);

    const [serviceType, setServiceType] = useState(
        'Oil Change'
    );

    const [serviceDate, setServiceDate] = useState(
        formatServiceDate(new Date())
    );

    const [mileage, setMileage] = useState('');

    const [cost, setCost] = useState('');

    const [notes, setNotes] = useState('');

    const isEditMode = Boolean(editingRecordId);

    const [
        showIosDatePicker,
        setShowIosDatePicker,
    ] = useState(false);

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

    function resetForm() {
        setEditingRecordId(null);
        setServiceType('Oil Change');
        setServiceDate(formatServiceDate(new Date()));
        setMileage('');
        setCost('');
        setNotes('');
    }

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

        if (Platform.OS === 'android') {
            openAndroidDatePicker(
                serviceDate,
                setServiceDate
            );

            return;
        }

        setShowIosDatePicker(true);
    }

    async function saveServiceHandler() {
        if (
            isSaving ||
            isDeleting ||
            !selectedVehicleId ||
            !user?.id
        ) {
            return;
        }

        const validationError = validateServiceRecord({
            serviceType,
            serviceDate,
            mileage,
            cost,
        });

        if (validationError) {
            Alert.alert(
                'Validation Error',
                validationError
            );

            return;
        }

        Keyboard.dismiss();

        const serviceData = {
            serviceType,
            serviceDate,
            mileage: mileage.trim(),
            cost: cost.trim() || '0',
            notes,
        };

        try {
            await saveRecord(
                serviceData,
                editingRecordId
            );

            setShowForm(false);

            resetForm();
        } catch (error) {
            Alert.alert(
                'Save Error',
                error.message ||
                'Unable to save service record.'
            );
        }
    }

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
                        try {
                            await removeRecord(record.id);
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

    function selectVehicleHandler(vehicleId) {
        if (
            isSaving ||
            isDeleting ||
            vehicleId === selectedVehicleId
        ) {
            return;
        }

        setShowForm(false);
        setShowIosDatePicker(false);

        resetForm();

        setSelectedVehicleId(vehicleId);
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
                            onRefresh={() => {
                                refreshRecords().catch(() => {
                                });
                            }}
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
                            <VehicleSelector
                                vehicles={vehicles}
                                selectedVehicleId={selectedVehicleId}
                                onSelectVehicle={selectVehicleHandler}
                                disabled={isSaving || isDeleting}
                            />

                            {!isLoading && error && (
                                <MaintenanceStats
                                    records={records}
                                />
                            )}

                            <View style={styles.historyHeader}>
                                <Text style={styles.sectionTitle}>
                                    Service History
                                </Text>

                                <Text style={styles.recordCount}>
                                    {`${records.length} record${records.length === 1 ? '' : 's'
                                        }`}
                                </Text>
                            </View>

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

                            {isLoading ? (
                                <ActivityIndicator
                                    size="large"
                                    color="#FF7A00"
                                    style={styles.loader}
                                />
                            ) : error ? (
                                <View style={styles.emptyCard}>
                                    <Ionicons
                                        name="cloud-offline-outline"
                                        size={48}
                                        color="#EF4444"
                                    />
                                    <Text style={styles.emptyTitle}>
                                        Unable to Load Services
                                    </Text>

                                    <Text style={styles.emptyText}>
                                        {error}
                                    </Text>

                                    <Pressable
                                        style={styles.retryButton}
                                        onPress={() => {
                                            refreshRecords().catch(() => {
                                            });
                                        }}
                                    >
                                        <Ionicons
                                            name="refresh-outline"
                                            size={20}
                                            color="#FFFFFF"
                                        />

                                        <Text style={styles.retryButtonText}>
                                            Try Again
                                        </Text>
                                    </Pressable>
                                            
                                </View>
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
            <ServiceDatePicker
                value={serviceDate}
                onChange={setServiceDate}
                visible={showIosDatePicker}
                onClose={() => setShowIosDatePicker(false)}
            />
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
    retryButton: {
    backgroundColor: '#FF7A00',
    borderRadius: 12,
    paddingHorizontal: 24,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    marginTop: 12,
},

retryButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
},
});