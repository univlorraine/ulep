import { Injectable } from '@nestjs/common';
import { NotificationServicePort } from 'src/core/ports/notification.service';

@Injectable()
export class NotificationService implements NotificationServicePort {
    constructor() {}

    async sendNotification(): Promise<void> {
        Promise.resolve();
    }
}
