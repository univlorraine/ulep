import { MediaObject } from 'src/core/models/media.model';

export const MEDIA_OBJECT_REPOSITORY = 'media-object.repository';

export interface MediaObjectRepository {
    saveFile: (object: MediaObject, messageId: string) => Promise<void>;

    saveThumbnail: (object: MediaObject, messageId: string) => Promise<void>;

    findOne(id: string): Promise<MediaObject | null>;

    remove(id: string): Promise<void>;

    findAllByConversationId(conversationId: string): Promise<MediaObject[]>;
}
