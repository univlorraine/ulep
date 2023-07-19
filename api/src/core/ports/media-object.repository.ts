import MediaObject from '../models/media-object';
import { User } from '../models/user';

export interface MediaObjectRepository {
  of: (id: string) => Promise<MediaObject | null>;

  saveAvatar: (user: User, object: MediaObject) => Promise<void>;

  delete: (object: MediaObject) => Promise<void>;
}
