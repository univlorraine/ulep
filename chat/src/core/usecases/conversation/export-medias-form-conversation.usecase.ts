import {
    Inject,
    Injectable,
    NotFoundException,
    StreamableFile,
} from '@nestjs/common';
import { Conversation } from 'src/core/models';
import { MediaObject } from 'src/core/models/media.model';
import {
    CONVERSATION_REPOSITORY,
    ConversationRepository,
} from 'src/core/ports/conversation.repository';
import {
    MEDIA_OBJECT_REPOSITORY,
    MediaObjectRepository,
} from 'src/core/ports/media-object.repository';
import {
    STORAGE_INTERFACE,
    StorageInterface,
} from 'src/core/ports/storage.interface';
import { createReadStream, createWriteStream } from 'fs';
import { create } from 'archiver';
import {
    MESSAGE_REPOSITORY,
    MessageRepository,
} from 'src/core/ports/message.repository';

type ExportMediasFromConversationParams = {
    id: string;
};

@Injectable()
export class ExportMediasFromConversationUsecase {
    constructor(
        @Inject(CONVERSATION_REPOSITORY)
        private readonly conversationRepository: ConversationRepository,
        @Inject(MEDIA_OBJECT_REPOSITORY)
        private readonly mediaObjectRepository: MediaObjectRepository,
        @Inject(STORAGE_INTERFACE)
        private readonly storage: StorageInterface,
        @Inject(MESSAGE_REPOSITORY)
        private readonly messageRepository: MessageRepository,
    ) {}

    async execute(
        params: ExportMediasFromConversationParams,
    ): Promise<StreamableFile> {
        const { id } = params;

        const conversation = await this.tryFindConversationById(id);

        const medias = await this.tryFindMediasByConversationId(
            conversation.id,
        );

        return this.exportMedias(conversation.id, medias);
    }

    async tryFindConversationById(
        id: string,
    ): Promise<Conversation | undefined> {
        const conversation = await this.conversationRepository.findById(id);

        if (!conversation) {
            throw new NotFoundException('Conversation not found');
        }

        return conversation;
    }

    async tryFindMediasByConversationId(
        conversationId: string,
    ): Promise<MediaObject[]> {
        const medias = await this.mediaObjectRepository.findAllByConversationId(
            conversationId,
        );

        if (!medias) {
            throw new NotFoundException('Medias not found');
        }

        return medias;
    }

    async exportMedias(
        conversationId: string,
        medias: MediaObject[],
    ): Promise<StreamableFile> {
        const tmpPath = `/tmp/${conversationId}.zip`;
        const output = createWriteStream(tmpPath);
        const archive = create('zip', {
            zlib: { level: 9 }, // Sets the compression level.
            readableObjectMode: true,
        });

        archive.pipe(output);

        for (const media of medias) {
            const file = await this.storage.read('chat', media.name);
            const message = await this.messageRepository.findByMediaId(
                media.id,
            );

            archive.append(file, {
                name: message.metadata.originalFilename,
            });
        }

        await archive.finalize();

        const stream = createReadStream(tmpPath);

        return new StreamableFile(stream, {
            type: 'application/zip, application/octet-stream',
            disposition: `attachment; filename="${conversationId}.zip"`,
        });
    }
}

export default ExportMediasFromConversationUsecase;
