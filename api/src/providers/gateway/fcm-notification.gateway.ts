/**
 *
 *   Copyright ou © ou Copr. Université de Lorraine, (2025)
 *
 *   Direction du Numérique de l'Université de Lorraine - SIED
 *
 *   Ce logiciel est un programme informatique servant à rendre accessible
 *   sur mobile et sur internet l'application ULEP (University Language
 *   Exchange Programme) aux étudiants et aux personnels des universités
 *   parties prenantes.
 *
 *   Ce logiciel est régi par la licence CeCILL 2.1, soumise au droit français
 *   et respectant les principes de diffusion des logiciels libres. Vous pouvez
 *   utiliser, modifier et/ou redistribuer ce programme sous les conditions
 *   de la licence CeCILL telle que diffusée par le CEA, le CNRS et INRIA
 *   sur le site "http://cecill.info".
 *
 *   En contrepartie de l'accessibilité au code source et des droits de copie,
 *   de modification et de redistribution accordés par cette licence, il n'est
 *   offert aux utilisateurs qu'une garantie limitée. Pour les mêmes raisons,
 *   seule une responsabilité restreinte pèse sur l'auteur du programme, le
 *   titulaire des droits patrimoniaux et les concédants successifs.
 *
 *   À cet égard, l'attention de l'utilisateur est attirée sur les risques
 *   associés au chargement, à l'utilisation, à la modification et/ou au
 *   développement et à la reproduction du logiciel par l'utilisateur étant
 *   donné sa spécificité de logiciel libre, qui peut le rendre complexe à
 *   manipuler et qui le réserve donc à des développeurs et des professionnels
 *   avertis possédant des connaissances informatiques approfondies. Les
 *   utilisateurs sont donc invités à charger et à tester l'adéquation du
 *   logiciel à leurs besoins dans des conditions permettant d'assurer la
 *   sécurité de leurs systèmes et/ou de leurs données et, plus généralement,
 *   à l'utiliser et à l'exploiter dans les mêmes conditions de sécurité.
 *
 *   Le fait que vous puissiez accéder à cet en-tête signifie que vous avez
 *   pris connaissance de la licence CeCILL 2.1, et que vous en avez accepté les
 *   termes.
 *
 */

import { FCMService, I18nService } from '@app/common';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Env } from 'src/configuration';
import {
  NotificationGateway,
  NotificationParams,
  SendActivityStatusChangeNotification,
  SendMessageDeletedNotification,
  SendMessageNotification,
  SendSessionCanceledNotification,
  SendSessionCreatedNotification,
  SendSessionStartNotification,
  SendSessionUpdatedNotification,
  SendTandemClosureNoticeNotification,
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

  async sendWelcomeNotification(props: NotificationParams): Promise<void> {
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

  async sendTandemClosureNoticeNotification(
    props: SendTandemClosureNoticeNotification,
  ): Promise<void> {
    const image = this.images.notification;
    const notifications = props.to.map((notification) => {
      const translation = this.translate(
        'tandemClosureNotice',
        notification.language,
        {
          ...props,
        },
      );
      return {
        token: notification.token,
        title: translation.title,
        body: translation.body,
        image,
      };
    });
    await this.sender.sendNotifications(notifications);
  }

  async sendPausedTandemNotification(props: NotificationParams): Promise<void> {
    const image = this.images.notification;
    const notifications = props.to.map((notification) => {
      const translation = this.translate(
        'tandemPaused',
        notification.language,
        {
          ...props,
        },
      );
      return {
        token: notification.token,
        title: translation.title,
        body: translation.body,
        image,
      };
    });
    await this.sender.sendNotifications(notifications);
  }

  async sendUnpausedTandemNotification(
    props: NotificationParams,
  ): Promise<void> {
    const image = this.images.notification;
    const notifications = props.to.map((notification) => {
      const translation = this.translate(
        'tandemUnpaused',
        notification.language,
        {
          ...props,
        },
      );
      return {
        token: notification.token,
        title: translation.title,
        body: translation.body,
        image,
      };
    });

    await this.sender.sendNotifications(notifications);
  }

  async sendMessageNotification(props: SendMessageNotification): Promise<void> {
    const image = this.images.notification;
    const notifications = props.to.map((notification) => {
      const translation = this.translate('message', notification.language, {
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
  async sendActivityPublishedNotification(
    props: SendActivityStatusChangeNotification,
  ): Promise<void> {
    const image = this.images.notification;
    const notifications = props.to.map((notification) => {
      const translation = this.translate(
        'activityPublished',
        notification.language,
        {
          ...props,
        },
      );
      return {
        token: notification.token,
        title: translation.title,
        body: translation.body,
        image,
      };
    });

    await this.sender.sendNotifications(notifications);
  }

  async sendActivityRejectedNotification(
    props: SendActivityStatusChangeNotification,
  ): Promise<void> {
    const image = this.images.notification;
    const notifications = props.to.map((notification) => {
      const translation = this.translate(
        'activityRejected',
        notification.language,
        {
          ...props,
        },
      );
      return {
        token: notification.token,
        title: translation.title,
        body: translation.body,
        image,
      };
    });

    await this.sender.sendNotifications(notifications);
  }

  async sendSessionStartNotification(
    props: SendSessionStartNotification,
  ): Promise<void> {
    const image = this.images.notification;
    const notifications = props.to.map((notification) => {
      const translation = this.translate(
        `sessionStart${props.type}`,
        notification.language,
        {
          ...props,
        },
      );
      return {
        token: notification.token,
        title: translation.title,
        body: translation.body,
        image,
      };
    });

    await this.sender.sendNotifications(notifications);
  }

  async sendSessionCanceledNotification(
    props: SendSessionCanceledNotification,
  ): Promise<void> {
    const image = this.images.notification;
    const notifications = props.to.map((notification) => {
      const translation = this.translate(
        'sessionCanceled',
        notification.language,
        {
          ...props,
        },
      );
      return {
        token: notification.token,
        title: translation.title,
        body: translation.body,
        image,
      };
    });
    await this.sender.sendNotifications(notifications);
  }

  async sendSessionUpdatedNotification(
    props: SendSessionUpdatedNotification,
  ): Promise<void> {
    const image = this.images.notification;
    const notifications = props.to.map((notification) => {
      const translation = this.translate(
        'sessionUpdated',
        notification.language,
        {
          ...props,
        },
      );
      return {
        token: notification.token,
        title: translation.title,
        body: translation.body,
        image,
      };
    });
    await this.sender.sendNotifications(notifications);
  }

  async sendSessionCreatedNotification(
    props: SendSessionCreatedNotification,
  ): Promise<void> {
    const image = this.images.notification;
    const notifications = props.to.map((notification) => {
      const translation = this.translate(
        'sessionCreated',
        notification.language,
        {
          ...props,
        },
      );
      return {
        token: notification.token,
        title: translation.title,
        body: translation.body,
        image,
      };
    });
    await this.sender.sendNotifications(notifications);
  }

  async sendMessageDeletedNotification(
    props: SendMessageDeletedNotification,
  ): Promise<void> {
    const image = this.images.notification;
    const notifications = props.to.map((notification) => {
      const translation = this.translate(
        'messageDeleted',
        notification.language,
        {
          ...props,
        },
      );
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
