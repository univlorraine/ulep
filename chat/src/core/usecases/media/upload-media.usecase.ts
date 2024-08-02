import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Message } from 'src/core/models';
import { MediaObject } from 'src/core/models/media.model';
import {
    CONVERSATION_REPOSITORY,
    ConversationRepository,
} from 'src/core/ports/conversation.repository';
import {
    MESSAGE_REPOSITORY,
    MessageRepository,
} from 'src/core/ports/message.repository';
import {
    MEDIA_OBJECT_REPOSITORY,
    MediaObjectRepository,
} from '../../ports/media-object.repository';
import {
    File,
    STORAGE_INTERFACE,
    StorageInterface,
} from '../../ports/storage.interface';

export class UploadMediaCommand {
    conversationId: string;
    message: Message;
    file: File;
    filename: string;
}

@Injectable()
export class UploadMediaUsecase {
    constructor(
        @Inject(MESSAGE_REPOSITORY)
        private readonly messageRepository: MessageRepository,
        @Inject(CONVERSATION_REPOSITORY)
        private readonly conversationRepository: ConversationRepository,
        @Inject(STORAGE_INTERFACE)
        private readonly storageInterface: StorageInterface,
        @Inject(MEDIA_OBJECT_REPOSITORY)
        private readonly mediaObjectRepository: MediaObjectRepository,
    ) {}

    async execute(command: UploadMediaCommand) {
        await this.assetConversationExist(command.conversationId);
        await this.assetMessageExist(command.message.id);

        const file = await this.upload(
            command.file,
            command.conversationId,
            command.message,
            command.filename,
        );

        return this.storageInterface.temporaryUrl('chat', file.name, 3600);
    }

    private async upload(
        file: Express.Multer.File,
        conversationId: string,
        message: Message,
        filename: string,
    ): Promise<MediaObject> {
        const image = MediaObject.generate(
            file,
            'chat',
            conversationId,
            filename,
        );
        await this.storageInterface.write('chat', image.name, file);
        await this.mediaObjectRepository.saveFile(image, message.id);

        return image;
    }

    private async assetConversationExist(conversationId: string) {
        const conversation = await this.conversationRepository.findById(
            conversationId,
        );

        if (!conversation) {
            throw new NotFoundException('Conversation not found');
        }
    }

    private async assetMessageExist(messageId: string) {
        const message = await this.messageRepository.findById(messageId);

        if (!message) {
            throw new NotFoundException('Message not found');
        }
    }
}
