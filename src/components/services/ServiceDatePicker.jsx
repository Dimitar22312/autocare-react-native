import { useState, useEffect } from 'react';

import {
    View,
    Text,
    Pressable,
    Modal,
    Platform,
    StyleSheet,
    Keyboard,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';

import DateTimePicker, {
    DateTimePickerAndroid,
} from '@react-native-community/datetimepicker';

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
        return new Date();
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
        return new Date();
    }

    return date;
}

export default function ServiceDatePicker({
    value,
    onChange,
    visible,
    onClose,
}) {
    const [temporaryDate, setTemporaryDate] = useState(
        parseDate(value)
    );

    useEffect(() => {
        if (visible) {
            setTemporaryDate(parseDate(value));
        }
    }, [visible, value]);

    function confirmDateHandler() {
        onChange(formatDate(temporaryDate));
        onClose();
    }

    if (Platform.OS !== 'ios') {
        return null;
    }

    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <View style={styles.content}>
                    <View style={styles.header}>
                        <Text style={styles.title}>
                            Select Service Date
                        </Text>

                        <Pressable onPress={onClose}>
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
                        style={styles.datePicker}
                    />

                    <Pressable
                        style={styles.confirmButton}
                        onPress={confirmDateHandler}
                    >
                        <Text style={styles.confirmText}>
                            Confirm Date
                        </Text>
                    </Pressable>
                </View>
            </View>
        </Modal>
    );
}

export function openAndroidDatePicker(value, onChange) {
    if (Platform.OS !== 'android') {
        return;
    }

    Keyboard.dismiss();

    DateTimePickerAndroid.open({
        value: parseDate(value),
        mode: 'date',
        maximumDate: new Date(),

        onChange: (event, selectedDate) => {
            if (
                event.type === 'set' &&
                selectedDate
            ) {
                onChange(formatDate(selectedDate));
            }
        },
    });
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
        justifyContent: 'center',
        paddingHorizontal: 24,
    },

    content: {
        backgroundColor: '#1C212B',
        borderRadius: 24,
        borderWidth: 1,
        borderColor: '#303641',
        padding: 20,
    },

    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 12,
    },

    title: {
        color: '#FFFFFF',
        fontSize: 19,
        fontWeight: 'bold',
    },

    datePicker: {
        height: 180,
        width: '100%',
    },

    confirmButton: {
        backgroundColor: '#FF7A00',
        borderRadius: 12,
        paddingVertical: 15,
        alignItems: 'center',
        marginTop: 14,
    },

    confirmText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
});