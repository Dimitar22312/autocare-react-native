import { Platform } from 'react-native';

import * as Notifications from 'expo-notifications';

const CHANNEL_ID = 'autocare-reminders';

const MAX_SCHEDULED_REMINDERS = 50;

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowBanner: true,
        shouldShowList: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
    }),
});

export async function setupNotificationChannel() {
    if (Platform.OS !== 'android') {
        return;
    }

    await Notifications.setNotificationChannelAsync(
        CHANNEL_ID,
        {
            name: 'AutoCare Reminders',
            importance: Notifications.AndroidImportance.HIGH,
            sound: 'default',
            vibrationPattern: [0, 250, 250, 250],
            lightColor: '#FF7A00',
        }
    );
}

export async function hasNotificationPermission() {
    const permissions =
        await Notifications.getPermissionsAsync();

    return permissions.granted;
}

export async function requestNotificationPermission() {
    await setupNotificationChannel();

    const currentPermissions =
        await Notifications.getPermissionsAsync();

    if (currentPermissions.granted) {
        return true;
    }

    const requestedPermissions =
        await Notifications.requestPermissionsAsync();

    return requestedPermissions.granted;
}

export async function cancelReminderNotifications() {
    const scheduled =
        await Notifications.getAllScheduledNotificationsAsync();

    const autocareReminders = scheduled.filter(
        (notification) =>
            notification.content.data?.autocareType ===
            'reminder'
    );

    for (const notification of autocareReminders) {
        await Notifications.cancelScheduledNotificationAsync(
            notification.identifier
        );
    }
}

function getNotificationDate(dueDate) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(dueDate)) {
        return null;
    }

    const [year, month, day] = dueDate
        .split('-')
        .map(Number);

    const date = new Date(
        year,
        month - 1,
        day,
        9,
        0,
        0
    );

    if (
        date.getFullYear() !== year ||
        date.getMonth() !== month - 1 ||
        date.getDate() !== day
    ) {
        return null;
    }

    const notificationDate = new Date(date);

    notificationDate.setDate(
        notificationDate.getDate() - 1
    );

    if (notificationDate > new Date()) {
        return {
            date: notificationDate,
            isDayBefore: true,
        };
    }

    if (date > new Date()) {
        return {
            date,
            isDayBefore: false,
        };
    }

    return null;
}

export async function syncReminderNotifications(
    reminders,
    vehicles,
    userId,
    enabled
) {
    await cancelReminderNotifications();

    if (!enabled || !userId) {
        return;
    }

    const hasPermission =
        await hasNotificationPermission();

    if (!hasPermission) {
        return;
    }

    await setupNotificationChannel();

    const activeReminders = reminders
        .filter((reminder) => !reminder.is_completed)
        .map((reminder) => ({
            reminder,
            schedule: getNotificationDate(
                reminder.due_date
            ),
        }))
        .filter((item) => item.schedule !== null)
        .sort(
            (a, b) =>
                a.schedule.date.getTime() -
                b.schedule.date.getTime()
        )
        .slice(0, MAX_SCHEDULED_REMINDERS);

    for (const { reminder, schedule } of activeReminders) {
        const vehicle = vehicles.find(
            (item) => item.id === reminder.vehicle_id
        );

        const vehicleName = vehicle
            ? `${vehicle.brand} ${vehicle.model}`
            : 'your vehicle';

        const message = schedule.isDayBefore
            ? `${reminder.title} for ${vehicleName} is due tomorrow!`
            : `${reminder.title} for ${vehicleName} is due today!`;

        await Notifications.scheduleNotificationAsync({
            content: {
                title: '🔔 AutoCare Reminder',
                body: message,

                sound: 'default',

                data: {
                    autocareType: 'reminder',
                    reminderId: reminder.id,
                    userId,
                },
            },

            trigger: {
                type:
                    Notifications.SchedulableTriggerInputTypes.DATE,

                date: schedule.date,
                channelId: CHANNEL_ID,
            },
        });
    }
}

export async function sendTestNotification() {
    await setupNotificationChannel();

    await Notifications.scheduleNotificationAsync({
        content: {
            title: '🏎️ AutoCare',
            body:
                'Notifications are working! Your vehicle is in good hands.',

            sound: 'default',

            data: {
                autocareType: 'test',
            },
        },

        trigger: {
            type:
                Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,

            seconds: 5,
            channelId: CHANNEL_ID,
        },
    });
}