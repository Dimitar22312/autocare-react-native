export function validateVehicle({
    brand,
    model,
    year,
    fuelType,
    mileage,
    nextOilChange,
}) {
    const errors = {};

    const brandValue = String(brand ?? '').trim();
    const modelValue = String(model ?? '').trim();
    const yearValue = String(year ?? '').trim();
    const fuelTypeValue = String(fuelType ?? '').trim();
    const mileageValue = String(mileage ?? '').trim();
    const oilChangeValue = String(nextOilChange ?? '').trim();

    const currentYear = new Date().getFullYear();

    if (!brandValue) {
        errors.brand = 'Brand is required.';
    } else if (brandValue.length < 2) {
        errors.brand = 'Brand must be at least 2 characters.';
    } else if (brandValue.length > 50) {
        errors.brand = 'Brand must be 50 characters or fewer.';
    }

    if (!modelValue) {
        errors.model = 'Model is required.';
    } else if (modelValue.length > 50) {
        errors.model = 'Model must be 50 characters or fewer.';
    }

    if (!/^\d{4}$/.test(yearValue)) {
        errors.year = 'Enter a 4-digit production year.';
    } else if (
        Number(yearValue) < 1886 ||
        Number(yearValue) > currentYear + 1
    ) {
        errors.year =
            `Year must be between 1886 and ${currentYear + 1}.`;
    }

    if (!fuelTypeValue) {
        errors.fuelType = 'Please select a fuel type.';
    }

    if (
        !/^\d+$/.test(mileageValue) ||
        !Number.isSafeInteger(Number(mileageValue))
    ) {
        errors.mileage =
            'Mileage must be a non-negative whole number.';
    }

    if (
        !/^\d+$/.test(oilChangeValue) ||
        !Number.isSafeInteger(Number(oilChangeValue))
    ) {
        errors.nextOilChange =
            'Oil change mileage must be a non-negative whole number.';
    }

    return errors;
}