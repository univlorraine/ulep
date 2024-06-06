import { Injectable, Logger } from '@nestjs/common';
import { File, StorageInterface } from 'src/core/ports/storage.interface';
import { Readable } from 'stream';

@Injectable()
export class MinioStorage implements StorageInterface {
    logger = new Logger(MinioStorage.name);
    async read(bucket: string, filename: string): Promise<Readable> {
        return Promise.resolve(new Readable());
    }

    async write(bucket: string, name: string, file: File): Promise<void> {
        this.logger.debug('Write file', bucket, name, file);
    }

    async delete(bucket: string, name: string): Promise<void> {
        this.logger.debug('Delete file', bucket, name);
    }

    async temporaryUrl(
        bucket: string,
        name: string,
        expiry: number,
    ): Promise<string> {
        this.logger.debug('Temporary url', bucket, name, expiry);
        return '';
    }

    async fileExists(bucket: string, name: string): Promise<boolean> {
        return name !== 'error';
    }

    async directoryExists(bucket: string): Promise<boolean> {
        return bucket !== 'error';
    }

    async createDirectory(directory: string): Promise<void> {
        this.logger.debug('Create directory', directory);
    }

    private async makeBucketPrivate(bucket: string): Promise<void> {
        this.logger.debug('Make bucket private', bucket);
    }
}
