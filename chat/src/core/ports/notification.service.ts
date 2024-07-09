export const NOTIFICATION_SERVICE = 'notification.service';

export interface NotificationServicePort {
    sendNotification: (
        senderId: string,
        usersId: string[],
        content: string,
    ) => Promise<void>;
}
