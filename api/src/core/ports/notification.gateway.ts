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

export interface SendTandemClosureNoticeNotification {
  to: Notification[];
  university: {
    name: string;
    closeDate: string;
  };
}

export interface NotificationGateway {
  sendTandemClosureNoticeNotification(
    props: SendTandemClosureNoticeNotification,
  ): Promise<void>;
  sendWelcomeNotification: NotificationFunction;
  sendPausedTandemNotification: NotificationFunction;
  sendUnpausedTandemNotification: NotificationFunction;
}
