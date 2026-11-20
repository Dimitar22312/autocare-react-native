import { supabase } from '../lib/supabase';

export async function getServiceRecords(userId, vehicleId) {
    const { data, error } = await supabase
        .from('service_records')
        .select('*')
        .eq('user_id', userId)
        .eq('vehicle_id', vehicleId)
        .order('service_date', {
            ascending: false,
        });

    if (error) {
        throw error;
    }

    return data ?? [];
}

export async function createServiceRecord(
    userId,
    vehicleId,
    serviceData
) {
    const { data, error } = await supabase
        .from('service_records')
        .insert({
            user_id: userId,
            vehicle_id: vehicleId,

            service_type: serviceData.serviceType,
            service_date: serviceData.serviceDate,

            mileage: Number(serviceData.mileage),
            cost: Number(serviceData.cost),

            notes: serviceData.notes.trim(),
        })
        .select()
        .single();

    if (error) {
        throw error;
    }

    return data;
}

export async function deleteServiceRecord(
    userId,
    recordId
) {
    const { error } = await supabase
        .from('service_records')
        .delete()
        .eq('id', recordId)
        .eq('user_id', userId);

    if (error) {
        throw error;
    }
}