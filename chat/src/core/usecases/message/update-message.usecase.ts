import { Inject, NotFoundException } from '@nestjs/common';
import {
    MESSAGE_REPOSITORY,
    MessageRepository,
} from 'src/core/ports/message.repository';

interface CreateMessageCommand {
    messageId: string;
    content: string;
    isReported: boolean;
}

export class UpdateMessageUsecase {
    constructor(
        @Inject(MESSAGE_REPOSITORY)
        private readonly messageRepository: MessageRepository,
    ) {}

    async execute(command: CreateMessageCommand) {
        const message = await this.messageRepository.findById(
            command.messageId,
        );

        if (!message) {
            throw new NotFoundException('Message not found');
        }

        const updatedMessage = await this.messageRepository.update({
            ...message,
            isReported:
                command.isReported !== undefined
                    ? command.isReported
                    : message.isReported,
            content: command.content || message.content,
        });

        return updatedMessage;
    }
}
