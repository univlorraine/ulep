import {
  NotificationGateway,
  SendTandemClosureNoticeNotification,
  SendWelcomeNotification,
} from 'src/core/ports/notification.gateway';

export default class InMemoryNotificaitonGateway
  implements NotificationGateway
{
  sendWelcomeNotification(): Promise<void> {
    return Promise.resolve();
  }

  sendTandemClosureNoticeNotification(
    props: SendTandemClosureNoticeNotification,
  ): Promise<void> {
    return Promise.resolve();
  }
}
