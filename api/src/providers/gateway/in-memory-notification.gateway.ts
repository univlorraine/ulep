import {
  NotificationGateway,
  SendWelcomeNotification,
} from 'src/core/ports/notification.gateway';

export default class InMemoryNotificaitonGateway
  implements NotificationGateway
{
  sendWelcomeNotification(): Promise<void> {
    console.log('Notificaiton send');
    return;
  }
}
