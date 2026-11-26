import {
    useState,
    useEffect,
    useCallback,
    useRef,
} from 'react';

import {
    getServiceRecords,
    createServiceRecord,
    updateServiceRecord,
    deleteServiceRecord,
} from '../services/serviceRecordService';

function getErrorMessage(error) {
    const message = String(error?.message || '');

    const isNetworkError =
        /fetch failed|network request failed|offline|internet connection/i.test(
            message
        );

    if (isNetworkError) {
        return 'Please check your internet connection and try again.';
    }

    return message || 'Unable to load service history.';
}

export default function useServiceRecords(
    userId,
    vehicleId
) {
    const [records, setRecords] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [error, setError] = useState(null);
    const latestRequestId = useRef(0);

    const loadRecords = useCallback(
        async (refresh = false) => {
            const requestId = ++latestRequestId.current;

            if (!userId || !vehicleId) {
                setRecords([]);
                setError(null);
                setIsLoading(false);
                setIsRefreshing(false);

                return;
            }

            setError(null);

            if (refresh) {
                setIsRefreshing(true);
            } else {
                setIsLoading(true);
            }

            try {
                const data = await getServiceRecords(
                    userId,
                    vehicleId
                );

                if (requestId !== latestRequestId.current) {
                    return;
                }

                setRecords(data ?? []);
            } catch (err) {
                if (requestId !== latestRequestId.current) {
                    return;
                }

                setError(getErrorMessage(err));

                throw err;
            } finally {
                if (requestId === latestRequestId.current) {
                    setIsLoading(false);
                    setIsRefreshing(false);
                }
            }
        },
        [userId, vehicleId]
    );

    useEffect(() => {
        setRecords([]);

        loadRecords().catch((err) => {
            console.error(
                'Error loading service records:',
                err
            );
        });

        return () => {
            latestRequestId.current += 1;
        };
    }, [loadRecords]);

    const refreshRecords = useCallback(
        async () => {
            await loadRecords(true);
        },
        [loadRecords]
    );

    async function saveRecord(
        serviceData,
        editingRecordId = null
    ) {
        if (!userId || !vehicleId) {
            throw new Error('No vehicle selected.');
        }

        if (isSaving || isDeleting) {
            return;
        }

        setIsSaving(true);

        try {
            if (editingRecordId) {
                await updateServiceRecord(
                    userId,
                    editingRecordId,
                    serviceData
                );
            } else {
                await createServiceRecord(
                    userId,
                    vehicleId,
                    serviceData
                );
            }

            await loadRecords();
        } finally {
            setIsSaving(false);
        }
    }

    async function removeRecord(recordId) {
        if (!userId || !vehicleId) {
            throw new Error('No vehicle selected.');
        }

        if (isSaving || isDeleting) {
            return;
        }

        setIsDeleting(true);

        try {
            await deleteServiceRecord(
                userId,
                recordId
            );

            await loadRecords();
        } finally {
            setIsDeleting(false);
        }
    }

    return {
        records,
        error,

        isLoading,
        isRefreshing,
        isSaving,
        isDeleting,

        loadRecords,
        refreshRecords,

        saveRecord,
        removeRecord,
    };
}