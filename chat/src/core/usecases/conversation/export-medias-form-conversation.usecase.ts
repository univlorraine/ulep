import { Inject, Injectable, NotFoundException } from '@nestjs/common';
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
import {
    createReadStream,
    createWriteStream,
    ReadStream,
    WriteStream,
} from 'fs';
import { create } from 'archiver';

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
    ) {}

    async execute(
        params: ExportMediasFromConversationParams,
    ): Promise<ReadStream> {
        const { id } = params;

        const conversation = await this.tryFindConversationById(id);

        const medias = await this.tryFindMediasByConversationId(
            conversation.id,
        );

        return this.exportMedias(medias);
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

    async exportMedias(medias: MediaObject[]): Promise<ReadStream> {
        const output = createWriteStream(__dirname + '/example.zip');
        const archive = create('zip', {
            zlib: { level: 9 }, // Sets the compression level.
        });

        archive.pipe(output);

        for (const media of medias) {
            const file = await this.storage.read('chat', media.name);
            archive.append(file, { name: media.name });
        }

        archive.finalize();

        return createReadStream(__dirname + '/example.zip');
    }
}

export default ExportMediasFromConversationUsecase;
