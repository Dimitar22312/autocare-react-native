import {
    useState,
    useEffect,
} from 'react';

import { Alert } from 'react-native';

import { validateVehicle } from '../utils/vehicleValidation';

export default function useVehicleForm({
    visible,
    vehicleToEdit,
    onAddVehicle,
    onUpdateVehicle,
}) {
    const [brand, setBrand] = useState('');
    const [model, setModel] = useState('');
    const [year, setYear] = useState('');
    const [fuelType, setFuelType] = useState('');
    const [mileage, setMileage] = useState('');
    const [nextOilChange, setNextOilChange] = useState('');
    const [imageUri, setImageUri] = useState(null);
    const [isNewImageSelected, setIsNewImageSelected] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [errors, setErrors] = useState({});

    const isEditMode = Boolean(vehicleToEdit);

    useEffect(() => {
        if (!visible) {
            return;
        }

        setBrand(vehicleToEdit?.brand ?? '');
        setModel(vehicleToEdit?.model ?? '');
        setYear(String(vehicleToEdit?.year ?? ''));
        setFuelType(vehicleToEdit?.fuelType ?? '');
        setMileage(String(vehicleToEdit?.mileage ?? ''));

        setNextOilChange(
            String(vehicleToEdit?.nextOilChange ?? '')
        );

        setImageUri(vehicleToEdit?.imageUri ?? null);
        setIsNewImageSelected(false);

        setErrors({});
    }, [visible, vehicleToEdit]);

    function updateField(field, value) {
        const setters = {
            brand: setBrand,
            model: setModel,
            year: setYear,
            fuelType: setFuelType,
            mileage: setMileage,
            nextOilChange: setNextOilChange,
        };

        setters[field]?.(value);

        setErrors((currentErrors) => {
            if (!currentErrors[field]) {
                return currentErrors;
            }

            const updatedErrors = { ...currentErrors };

            delete updatedErrors[field];

            return updatedErrors;
        });
    }

    function handleSelectedImage(imageAsset) {
        if (!imageAsset?.uri) {
            return;
        }

        setImageUri(imageAsset.uri);
        setIsNewImageSelected(true);
    }

    async function saveVehicleHandler() {
        if (isSaving) {
            return;
        }

        const validationErrors = validateVehicle({
            brand,
            model,
            year,
            fuelType,
            mileage,
            nextOilChange,
        });

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        setErrors({});
        setIsSaving(true);

        try {
            const vehicleData = {
                brand: brand.trim(),
                model: model.trim(),
                year: Number(year),
                fuelType: fuelType.trim(),
                mileage: Number(mileage),
                nextOilChange: Number(nextOilChange),

                imagePath:
                    vehicleToEdit?.imagePath ?? null,

                newImageUri:
                    isNewImageSelected ? imageUri : null,
            };

            if (isEditMode) {
                await onUpdateVehicle(
                    vehicleToEdit.id,
                    vehicleData
                );
            } else {
                await onAddVehicle(vehicleData);
            }

            setBrand('');
            setModel('');
            setYear('');
            setFuelType('');
            setMileage('');
            setNextOilChange('');

            setImageUri(null);
            setIsNewImageSelected(false);
            setErrors({});

        } catch (error) {
            console.error('Save Vehicle Error:', error);

            Alert.alert(
                'Save Vehicle Error',
                error.message ||
                    'Unable to save the vehicle.'
            );

        } finally {
            setIsSaving(false);
        }
    }

    return {
        brand,
        model,
        year,
        fuelType,
        mileage,
        nextOilChange,
        imageUri,
        isSaving,
        errors,
        isEditMode,
        updateField,
        handleSelectedImage,
        saveVehicleHandler,
    };
}