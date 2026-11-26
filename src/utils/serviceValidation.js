import { parseServiceDate } from './serviceDate';

export const SERVICE_TYPES = [
    'Oil Change',
    'Filters',
    'Brakes',
    'Tires',
    'Inspection',
    'Other',
];

export function validateServiceRecord({
    serviceType,
    serviceDate,
    mileage,
    cost,
}) {

    if (!SERVICE_TYPES.includes(serviceType)) {
        return 'Please select a service type.';
    }

    const selectedDate = parseServiceDate(serviceDate);

    if (!selectedDate) {
        return 'Please select a valid service date.';
    }

    const today = new Date();

    today.setHours(0, 0, 0, 0);

    if (selectedDate > today) {
        return 'Service date cannot be in the future.';
    }

    const mileageValue = String(mileage ?? '').trim();

    if (
        !/^\d+$/.test(mileageValue) ||
        !Number.isSafeInteger(Number(mileageValue))
    ) {
        return 'Mileage must be a non-negative whole number.';
    }

    const costValue = String(cost ?? '').trim();

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