import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { Env } from 'src/configuration';
import { NotificationServicePort } from 'src/core/ports/notification.service';

@Injectable()
export class NotificationService implements NotificationServicePort {
    private headers = {
        'Content-Type': 'application/json',
    };
    private readonly logger = new Logger(NotificationService.name);
    constructor(private readonly env: ConfigService<Env, true>) {}

    async sendNotification(
        senderId: string,
        usersId: string[],
        content: string,
    ): Promise<void> {
        try {
            await axios.post(
                this.env.get('API_URL') + '/notifications/',
                { content, senderId, usersId },
                { headers: this.headers },
            );
        } catch (error) {
            this.logger.error('Error while sending notification', { error });
        }
    }
}
