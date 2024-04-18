export const NOTIFICATION_GATEWAY = 'notification.gateway';

export interface Notification {
  token: string;
  language: string;
}

export interface SendWelcomeNotification {
  to: Notification[];
}

export interface NotificationGateway {
  sendWelcomeNotification(props: SendWelcomeNotification): Promise<void>;
}
