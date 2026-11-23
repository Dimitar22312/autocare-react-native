export function getMaintenanceStatus(vehicle) {
    const mileage = Number(vehicle.mileage);
    const nextOilChange = Number(vehicle.nextOilChange);

    if (
        !Number.isFinite(mileage) ||
        !Number.isFinite(nextOilChange) ||
        nextOilChange <= 0
    ) {
        return {
            status: 'UNKNOWN',
            remainingKm: null,
            message: 'Maintenance information unavailable.',
        };
    }

    const remainingKm = nextOilChange - mileage;

    if (remainingKm <= 0) {
        return {
            status: 'OVERDUE',
            remainingKm,
            message: `Oil change overdue by ${Math.abs(
                remainingKm
            ).toLocaleString()} km.`,
        };
    }

    if (remainingKm <= 1000) {
        return {
            status: 'DUE SOON',
            remainingKm,
            message: `Oil change due in ${remainingKm.toLocaleString()} km.`,
        };
    }

    return {
        status: 'GOOD',
        remainingKm,
        message: `Next oil change in ${remainingKm.toLocaleString()} km.`,
    };
}

export function getMaintenanceAlerts(vehicles = []) {
    return vehicles
        .map((vehicle) => ({
            id: vehicle.id,
            brand: vehicle.brand,
            model: vehicle.model,
            ...getMaintenanceStatus(vehicle),
        }))
        .filter(
            (alert) =>
                alert.status === 'DUE SOON' ||
                alert.status === 'OVERDUE'
        );
}