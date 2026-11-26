import {
    View,
    Text,
    Pressable,
    StyleSheet,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';

export default function ServiceCard({
    record,
    onEdit,
    onDelete,
    disabled = false,
}) {
    return (
        <View style={styles.container}>

            <View style={styles.header}>
                <View style={styles.iconContainer}>
                    <Ionicons
                        name="construct-outline"
                        size={24}
                        color="#FF7A00"
                    />
                </View>

                <View style={styles.titleContainer}>
                    <Text style={styles.title}>
                        {record.service_type}
                    </Text>

                    <Text style={styles.date}>
                        {record.service_date}
                    </Text>
                </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.details}>
                <View>
                    <Text style={styles.detailLabel}>
                        MILEAGE
                    </Text>

                    <Text style={styles.mileage}>
                        {Number(
                            record.mileage
                        ).toLocaleString()} km
                    </Text>
                </View>

                <View style={styles.costContainer}>
                    <Text style={styles.detailLabel}>
                        COST
                    </Text>

                    <Text style={styles.cost}>
                        {Number(
                            record.cost
                        ).toFixed(2)} €
                    </Text>
                </View>
            </View>

            {!!record.notes && (
                <Text style={styles.notes}>
                    {record.notes}
                </Text>
            )}

            {/* Actions */}

            <View style={styles.actions}>
                <Pressable
                    style={[
                        styles.editButton,
                        disabled && styles.disabledButton,
                    ]}
                    onPress={onEdit}
                    disabled={disabled}
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
                    style={[
                        styles.deleteButton,
                        disabled && styles.disabledButton,
                    ]}
                    onPress={onDelete}
                    disabled={disabled}
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

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#1C212B',
        borderRadius: 18,
        padding: 18,
        borderWidth: 1,
        borderColor: '#303641',
        marginBottom: 14,
    },

    header: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },

    iconContainer: {
        width: 46,
        height: 46,
        borderRadius: 13,
        backgroundColor: '#332519',
        justifyContent: 'center',
        alignItems: 'center',
    },

    titleContainer: {
        flex: 1,
    },

    title: {
        color: '#FFFFFF',
        fontSize: 17,
        fontWeight: 'bold',
        marginBottom: 5,
    },

    date: {
        color: '#9CA3AF',
        fontSize: 13,
    },

    divider: {
        height: 1,
        backgroundColor: '#303641',
        marginVertical: 15,
    },

    details: {
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

    mileage: {
        color: '#D1D5DB',
        fontSize: 15,
        fontWeight: '600',
    },

    costContainer: {
        alignItems: 'flex-end',
    },

    cost: {
        color: '#FF7A00',
        fontSize: 18,
        fontWeight: 'bold',
    },

    notes: {
        color: '#9CA3AF',
        fontSize: 13,
        lineHeight: 20,
        marginTop: 16,
    },

    actions: {
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

    disabledButton: {
        opacity: 0.5,
    },
});