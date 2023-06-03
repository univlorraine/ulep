import MediaObject from './media-object';

export interface MediaObjectRepository {
  of: (id: string) => Promise<MediaObject | null>;

  save: (object: MediaObject) => Promise<void>;
}
