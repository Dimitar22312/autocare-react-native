import { supabase } from '../lib/supabase';

export async function getReminders(userId) {
    const { data, error } = await supabase
        .from('reminders')
        .select('*')
        .eq('user_id', userId)
        .order('due_date', {
            ascending: true,
        });

    if (error) {
        throw error;
    }

    return data ?? [];
}

export async function createReminder(userId, reminderData) {
    const { data, error } = await supabase
        .from('reminders')
        .insert({
            user_id: userId,
            vehicle_id: reminderData.vehicleId,
            title: reminderData.title.trim(),
            description: reminderData.description?.trim() || null,
            due_date: reminderData.dueDate,
        })
        .select()
        .single();

    if (error) {
        throw error;
    }

    return data;
}

export async function updateReminder(
    userId,
    reminderId,
    reminderData
) {
    const { data, error } = await supabase
        .from('reminders')
        .update({
            vehicle_id: reminderData.vehicleId,
            title: reminderData.title.trim(),
            description: reminderData.description?.trim() || null,
            due_date: reminderData.dueDate,
        })
        .eq('id', reminderId)
        .eq('user_id', userId)
        .select()
        .single();

    if (error) {
        throw error;
    }

    return data;
}

export async function toggleReminderCompleted(
    userId,
    reminderId,
    isCompleted
) {
    const { data, error } = await supabase
        .from('reminders')
        .update({
            is_completed: isCompleted,
        })
        .eq('id', reminderId)
        .eq('user_id', userId)
        .select()
        .single();

    if (error) {
        throw error;
    }

    return data;
}
export async function deleteReminder(userId, reminderId) {
    const { error } = await supabase
        .from('reminders')
        .delete()
        .eq('id', reminderId)
        .eq('user_id', userId);

    if (error) {
        throw error;
    }
}