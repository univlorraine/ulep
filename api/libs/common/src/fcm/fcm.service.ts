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
    await firebase.app().delete();
  }

  private initialize() {
    if (firebase.apps.length > 0) {
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
      (batchedMessages) => this.handleBatch(batchedMessages, dryRun),
    );

    return batchResponse.reduce(
      ({ responses, successCount, failureCount }, currentResponse) => {
        return {
          responses: responses.concat(currentResponse.responses),
          successCount: successCount + currentResponse.successCount,
          failureCount: failureCount + currentResponse.failureCount,
        };
      },
      {
        responses: [],
        successCount: 0,
        failureCount: 0,
      } as BatchResponse,
    );
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
