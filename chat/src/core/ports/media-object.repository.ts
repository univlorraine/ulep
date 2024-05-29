import { MediaObject } from 'src/core/models/media.model';
import { Message } from 'src/core/models/message.model';

export const MEDIA_OBJECT_REPOSITORY = 'media-object.repository';

export interface MediaObjectRepository {
    saveFile: (object: MediaObject, message: Message) => Promise<void>;

    findOne(id: string): Promise<MediaObject | null>;

    remove(id: string): Promise<void>;
}
