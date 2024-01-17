import { Readable } from 'stream';

export type File = Express.Multer.File;

export const STORAGE_INTERFACE = 'storage.interface';

export interface StorageInterface {
  read(bucket: string, filename: string): Promise<Readable>;

  write(bucket: string, name: string, file: File): Promise<void>;

  delete(bucket: string, name: string): Promise<void>;

  temporaryUrl(bucket: string, name: string, expiry: number): Promise<string>;

  directoryExists(directory: string): Promise<boolean>;

  createDirectory(directory: string): Promise<void>;
}
