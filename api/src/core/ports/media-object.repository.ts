import MediaObject from '../models/media-object';

export interface MediaObjectRepository {
  of: (id: string) => Promise<MediaObject | null>;

  save: (object: MediaObject) => Promise<void>;

  delete: (object: MediaObject) => Promise<void>;
}
