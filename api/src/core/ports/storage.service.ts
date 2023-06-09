import MediaObject from '../models/media-object';

export interface StorageService {
  uploadFile(
    bucket: string,
    name: string,
    file: Express.Multer.File,
  ): Promise<void>;

  deleteFile(bucket: string, name: string): Promise<void>;

  getUrl(object: MediaObject): Promise<string>;
}
