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

import {
  Inject,
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import * as firebase from 'firebase-admin';
import { chunk } from 'lodash';
import { BatchResponse } from 'firebase-admin/lib/messaging/messaging-api';
import { mapLimit } from 'async';

export interface FCMConfiguration {
  firebaseProjectId: string;
  firebasePrivateKey: string;
  firebaseClientEmail: string;
  firebaseParallelLimit: number;
}

export const FCM_CONFIGURATION = 'FCM_CONFIGURATION';

export interface FCMOptions {
  data?: {
    [key: string]: string;
  };
  image: string;
  body: string;
  title: string;
  token: string;
}

@Injectable()
export class FCMService implements OnModuleInit, OnModuleDestroy {
  #logger: Logger;
  constructor(
    @Inject(FCM_CONFIGURATION) private readonly config: FCMConfiguration,
  ) {
    this.#logger = new Logger('FCMService');
  }

  onModuleInit() {
    this.initialize();
    this.#logger.log(`FCMService initialized`);
  }

  async onModuleDestroy() {
    if (firebase.apps.length > 0) {
      await firebase.app().delete();
    }
  }

  private initialize() {
    if (
      firebase.apps.length > 0 ||
      !this.config.firebaseProjectId ||
      !this.config.firebasePrivateKey ||
      !this.config.firebaseClientEmail
    ) {
      return;
    }
    const serviceAccount: firebase.ServiceAccount = {
      projectId: this.config.firebaseProjectId,
      privateKey: this.config.firebasePrivateKey.replace(/\\n/g, '\n'),
      clientEmail: this.config.firebaseClientEmail,
    };

    firebase.initializeApp({
      credential: firebase.credential.cert(serviceAccount),
    });
  }

  public async sendNotifications(messages: FCMOptions[], dryRun?: boolean) {
    // Split messages into chunks of 500 because firebase has a limit of 500 messages per batch
    const batchedMessages = chunk(messages, 500);

    const batchResponse = await mapLimit<FCMOptions, BatchResponse>(
      batchedMessages,
      this.config.firebaseParallelLimit,
      async (batchedMessages) =>
        await this.handleBatch(batchedMessages, dryRun),
    );

    const batchReduced = batchResponse.reduce(
      (acc, current) => {
        return {
          responses: acc.responses.concat(current.responses),
          successCount: acc.successCount + current.successCount,
          failureCount: acc.failureCount + current.failureCount,
        };
      },
      {
        responses: [],
        successCount: 0,
        failureCount: 0,
      },
    );

    this.#logger.log(
      `FCMService sent ${batchReduced.successCount} notifications successfully and ${batchReduced.failureCount} failed`,
    );

    return batchReduced;
  }

  private async sendAll(
    notifications: firebase.messaging.TokenMessage[],
    dryRun?: boolean,
  ): Promise<BatchResponse> {
    this.#logger.log(
      `Sending notifications to ${notifications.length} devices`,
    );
    return await firebase.messaging().sendEach(notifications, dryRun);
  }

  private async handleBatch(batchedMessages: FCMOptions[], dryRun?: boolean) {
    try {
      const notifications: firebase.messaging.TokenMessage[] =
        batchedMessages.map((message) => ({
          token: message.token,
          notification: {
            title: message.title,
            body: message.body,
            image: message.image,
          },
          data: message.data,
          apns: {
            payload: {
              aps: {
                contentAvailable: true,
              },
            },
          },
        }));

      return await this.sendAll(notifications, dryRun);
    } catch (error) {
      this.#logger.error(`Error sending notifications: ${error}`);
      return {
        responses: batchedMessages.map(() => ({ success: false, error })),
        successCount: 0,
        failureCount: batchedMessages.length,
      };
    }
  }
}
