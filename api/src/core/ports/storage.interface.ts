export type File = Express.Multer.File;

export const STORAGE_INTERFACE = 'storage.interface';

export interface StorageInterface {
  uploadFile(bucket: string, name: string, file: File): Promise<void>;

  deleteFile(bucket: string, name: string): Promise<void>;

  getPresignedUrl(bucket: string, name: string): Promise<string>;
}
