import { ActionPerformed, PushNotifications, PushNotificationSchema, Token } from '@capacitor/push-notifications';
import NotificationAdapterInterface from './interfaces/NotificationAdapter.interface';
import { FCM } from '@capacitor-community/fcm';

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
        PushNotifications.addListener('pushNotificationReceived', (notification: PushNotificationSchema) => {
            callback(notification);
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
