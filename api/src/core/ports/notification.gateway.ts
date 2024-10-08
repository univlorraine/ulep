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

export interface SendMessageNotification {
  to: Notification[];
  content: string;
  sender: {
    firstname: string;
    lastname: string;
  };
}

type SessionParams = {
  date: string;
  hour: string;
  partnerName: string;
};

export interface SendSessionStartNotification {
  to: Notification[];
  type: 'FifteenMinutes' | 'Daily';
  session: SessionParams;
}

export interface SendSessionCanceledNotification {
  to: Notification[];
  session: SessionParams;
}

export interface SendSessionCreatedNotification {
  to: Notification[];
  session: SessionParams;
}

export interface SendSessionUpdatedNotification {
  to: Notification[];
  session: SessionParams;
}

export interface NotificationGateway {
  sendTandemClosureNoticeNotification(
    props: SendTandemClosureNoticeNotification,
  ): Promise<void>;
  sendWelcomeNotification: NotificationFunction;
  sendPausedTandemNotification: NotificationFunction;
  sendUnpausedTandemNotification: NotificationFunction;
  sendMessageNotification(props: SendMessageNotification): Promise<void>;
  sendSessionStartNotification(
    props: SendSessionStartNotification,
  ): Promise<void>;
  sendSessionCanceledNotification(
    props: SendSessionCanceledNotification,
  ): Promise<void>;
  sendSessionCreatedNotification(
    props: SendSessionCreatedNotification,
  ): Promise<void>;
  sendSessionUpdatedNotification(
    props: SendSessionUpdatedNotification,
  ): Promise<void>;
}
