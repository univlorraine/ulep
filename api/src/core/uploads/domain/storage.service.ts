import MediaObject from './media-object';

export interface StorageService {
  uploadFile(
    bucket: string,
    name: string,
    file: Express.Multer.File,
  ): Promise<void>;

  getUrl(object: MediaObject): Promise<string>;
}
