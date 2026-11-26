import {
    View,
    Text,
    TextInput,
    StyleSheet,
} from 'react-native';

import FuelTypePicker from '../FuelTypePicker';

export default function VehicleFormFields({
    brand,
    model,
    year,
    fuelType,
    mileage,
    nextOilChange,
    errors,
    disabled,
    onFieldChange,
}) {
    return (
        <View>
            <Text style={styles.sectionTitle}>
                Vehicle Information
            </Text>

            <Text style={styles.label}>Brand</Text>

            <TextInput
                style={[
                    styles.input,
                    errors.brand && styles.inputError,
                ]}
                placeholder="Enter vehicle brand"
                placeholderTextColor="#888"
                value={brand}
                onChangeText={(value) =>
                    onFieldChange('brand', value)
                }
                editable={!disabled}
            />

            {errors.brand && (
                <Text style={styles.errorText}>
                    {errors.brand}
                </Text>
            )}

            <Text style={styles.label}>Model</Text>

            <TextInput
                style={[
                    styles.input,
                    errors.model && styles.inputError,
                ]}
                placeholder="Enter vehicle model"
                placeholderTextColor="#888"
                value={model}
                onChangeText={(value) =>
                    onFieldChange('model', value)
                }
                editable={!disabled}
            />

            {errors.model && (
                <Text style={styles.errorText}>
                    {errors.model}
                </Text>
            )}

            <Text style={styles.label}>Year</Text>

            <TextInput
                style={[
                    styles.input,
                    errors.year && styles.inputError,
                ]}
                placeholder="Enter production year"
                placeholderTextColor="#888"
                keyboardType="numeric"
                value={year}
                onChangeText={(value) =>
                    onFieldChange('year', value)
                }
                editable={!disabled}
            />

            {errors.year && (
                <Text style={styles.errorText}>
                    {errors.year}
                </Text>
            )}

            <Text style={styles.label}>Fuel Type</Text>

            <FuelTypePicker
                value={fuelType}
                onChange={(value) =>
                    onFieldChange('fuelType', value)
                }
                enabled={!disabled}
            />

            {errors.fuelType && (
                <Text style={styles.errorText}>
                    {errors.fuelType}
                </Text>
            )}

            <Text style={styles.label}>Mileage</Text>

            <TextInput
                style={[
                    styles.input,
                    errors.mileage && styles.inputError,
                ]}
                placeholder="Enter current mileage"
                placeholderTextColor="#888"
                keyboardType="default"
                value={mileage}
                onChangeText={(value) =>
                    onFieldChange('mileage', value)
                }
                editable={!disabled}
            />

            {errors.mileage && (
                <Text style={styles.errorText}>
                    {errors.mileage}
                </Text>
            )}

            <Text style={styles.label}>Next Oil Change</Text>

            <TextInput
                style={[
                    styles.input,
                    errors.nextOilChange &&
                        styles.inputError,
                ]}
                placeholder="Enter next oil change mileage"
                placeholderTextColor="#888"
                keyboardType="default"
                value={nextOilChange}
                onChangeText={(value) =>
                    onFieldChange('nextOilChange', value)
                }
                editable={!disabled}
            />

            {errors.nextOilChange && (
                <Text style={styles.errorText}>
                    {errors.nextOilChange}
                </Text>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    sectionTitle: {
        color: '#FFFFFF',
        fontSize: 19,
        fontWeight: 'bold',
        marginBottom: 15,
        marginTop: 10,
    },

    label: {
        color: '#FFFFFF',
        fontSize: 16,
        marginBottom: 8,
    },

    input: {
        backgroundColor: '#1C212B',
        color: '#FFFFFF',
        padding: 15,
        borderRadius: 10,
        marginBottom: 20,
        fontSize: 16,
    },

    inputError: {
        borderWidth: 1,
        borderColor: '#F87171',
    },

    errorText: {
        color: '#FCA5A5',
        fontSize: 13,
        marginTop: -14,
        marginBottom: 16,
        marginLeft: 2,
    },
});