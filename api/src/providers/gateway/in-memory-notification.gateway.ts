import { NotificationGateway } from 'src/core/ports/notification.gateway';

export default class InMemoryNotificaitonGateway
  implements NotificationGateway
{
  sendWelcomeNotification(): Promise<void> {
    return Promise.resolve();
  }

  sendTandemClosureNoticeNotification(): Promise<void> {
    return Promise.resolve();
  }

  sendPausedTandemNotification(): Promise<void> {
    return Promise.resolve();
  }

  sendUnpausedTandemNotification(): Promise<void> {
    return Promise.resolve();
  }
}
