export const NOTIFICATION_GATEWAY = 'notification.gateway';

export interface Notification {
  token: string;
  language: string;
}

export interface SendWelcomeNotification {
  to: Notification[];
}

export interface SendTandemClosureNoticeNotification {
  to: Notification[];
  university: {
    name: string;
    closeDate: string;
  };
}

export interface NotificationGateway {
  sendWelcomeNotification(props: SendWelcomeNotification): Promise<void>;
  sendTandemClosureNoticeNotification(
    props: SendTandemClosureNoticeNotification,
  ): Promise<void>;
}
