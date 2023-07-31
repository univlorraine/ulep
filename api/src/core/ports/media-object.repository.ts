import { MediaObject, User } from '../models';

export const MEDIA_OBJECT_REPOSITORY = 'media-object.repository';

export interface MediaObjectRepository {
  saveAvatar: (user: User, object: MediaObject) => Promise<void>;

  findAll(): Promise<MediaObject[]>;

  findOne(id: string): Promise<MediaObject | null>;

  remove(id: string): Promise<void>;
}
