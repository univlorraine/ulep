import MediaObject from '../models/media-object';
import { Profile } from '../models/profile';

export interface MediaObjectRepository {
  of: (id: string) => Promise<MediaObject | null>;

  saveProfileImage: (profile: Profile) => Promise<void>;

  delete: (object: MediaObject) => Promise<void>;
}
