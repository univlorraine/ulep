export const NOTIFICATION_GATEWAY = 'notification.gateway';

export interface Notification {
  token: string;
  language: string;
}

export type NotificationParams = {
  to: Notification[];
};

export type NotificationFunction = (
  params: NotificationParams,
) => Promise<void>;

export interface NotificationGateway {
  sendWelcomeNotification: NotificationFunction;
  sendPausedTandemNotification: NotificationFunction;
  sendUnpausedTandemNotification: NotificationFunction;
}
