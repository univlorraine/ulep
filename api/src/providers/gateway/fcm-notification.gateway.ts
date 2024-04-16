import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Env } from 'src/configuration';
import { FCMService, I18nService } from '@app/common';
import {
  NotificationGateway,
  SendWelcomeNotification,
} from 'src/core/ports/notification.gateway';

@Injectable()
export class FCMNotificationGateway implements NotificationGateway {
  constructor(
    private readonly env: ConfigService<Env, true>,
    private readonly i18n: I18nService,
    private readonly sender: FCMService,
  ) {}

  private get translationNamespace() {
    return (
      this.env.get('NOTIFICATION_TRANSLATION_NAMESPACE') || 'notifications'
    );
  }

  private get images() {
    const endpoint = this.env.get('NOTIFICATION_ASSETS_PUBLIC_ENDPOINT');
    const bucket = this.env.get('NOTIFICATION_ASSETS_BUCKET');

    return {
      notification: `${endpoint}/${bucket}/logo.png`,
    };
  }

  private translate(
    key: string,
    language: string,
    args?: Record<string, any>,
  ): Record<string, any> {
    const title = this.i18n.translate(`${key}.title`, {
      lng: language,
      ns: this.translationNamespace,
      ...args,
    });
    const body = this.i18n.translate(`${key}.body`, {
      lng: language,
      ns: this.translationNamespace,
      ...args,
    });
    return { title, body };
  }

  async sendWelcomeNotification(props: SendWelcomeNotification): Promise<void> {
    const image = this.images.notification;
    const notifications = props.to.map((notification) => {
      const translation = this.translate('welcome', notification.language, {
        ...props,
      });
      return {
        token: notification.token,
        title: translation.title,
        body: translation.body,
        image,
      };
    });
    await this.sender.sendNotifications(notifications);
  }
}
