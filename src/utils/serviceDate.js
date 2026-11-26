export function formatServiceDate(date) {
    const year = date.getFullYear();

    const month = String(
        date.getMonth() + 1
    ).padStart(2, '0');

    const day = String(
        date.getDate()
    ).padStart(2, '0');

    return `${year}-${month}-${day}`;
}

export function parseServiceDate(dateString) {
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