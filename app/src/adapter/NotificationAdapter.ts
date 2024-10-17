import { FCM } from '@capacitor-community/fcm';
import { App } from '@capacitor/app';
import { ActionPerformed, PushNotifications, PushNotificationSchema } from '@capacitor/push-notifications';
import NotificationAdapterInterface from './interfaces/NotificationAdapter.interface';

class NotificationAdapter implements NotificationAdapterInterface {
    errorListener(callback: Function) {
        PushNotifications.addListener('registrationError', (error: any) => {
            callback(error);
        });
    }

    notificationActionListener(callback: Function) {
        PushNotifications.addListener('pushNotificationActionPerformed', (notification: ActionPerformed) => {
            callback(notification);
        });
    }

    async notificationPermission(): Promise<void> {
        const permission = await PushNotifications.requestPermissions();
        if (permission.receive === 'granted') {
            await PushNotifications.register();
        } else {
            console.warn('Permission not granted');
        }
    }

    notificationReceivedListener(callback: Function) {
        PushNotifications.addListener('pushNotificationReceived', async (notification: PushNotificationSchema) => {
            const appState = await App.getState();
            if (!appState.isActive) {
                callback(notification);
            } else {
                // Delete all notifications if the app is active
                await PushNotifications.removeAllDeliveredNotifications();
            }
        });
    }

    registrationListener(callback: Function) {
        PushNotifications.addListener('registration', async () => {
            // Use this to get fcm token rather than apns token for ios
            const { token } = await FCM.getToken();

            return callback(token);
        });
    }

    removeListeners(): void {
        PushNotifications.removeAllListeners();
    }
}

export default NotificationAdapter;
