import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import {
    MessageRepository,
    MESSAGE_REPOSITORY,
} from 'src/core/ports/message.repository';
import { Message } from 'src/core/models';

@Injectable()
export class GetMessageByIdUsecase {
    constructor(
        @Inject(MESSAGE_REPOSITORY)
        private readonly messageRepository: MessageRepository,
    ) {}

    async execute(id: string): Promise<Message> {
        const message = await this.messageRepository.findById(id);
        if (!message) {
            throw new NotFoundException('Message not found');
        }
        return message;
    }
}
