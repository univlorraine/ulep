import * as Minio from 'minio';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { File, StorageInterface } from 'src/core/ports/storage.interface';
import { ContentTypeException } from 'src/core/errors/content-type.exception';

/*
 * This is the implementation of the StorageInterface.
 * It uses the Minio client to upload files to the Minio server.
 * https://min.io/docs/minio/linux/developers/javascript/API.html
 */
@Injectable()
export class MinioStorage implements StorageInterface {
  private readonly minioClient: Minio.Client;

  constructor(private readonly configService: ConfigService) {
    this.minioClient = new Minio.Client({
      endPoint: 'minio',
      port: 9000,
      useSSL: false,
      accessKey: configService.get('MINIO_ACCESS_KEY'),
      secretKey: configService.get('MINIO_SECRET_KEY'),
    });
  }

  async uploadFile(bucket: string, name: string, file: File): Promise<void> {
    // Create bucket if not exists
    await this.createBucketIfNotExist(bucket);
    // Check if content type is allowed
    const allowedContentTypes = ['image/jpeg', 'image/png'];
    if (!allowedContentTypes.includes(file.mimetype)) {
      throw new ContentTypeException(file.mimetype);
    }

    await this.minioClient.putObject(bucket, name, file.buffer, file.size);
  }

  async getPresignedUrl(bucket: string, name: string): Promise<string> {
    return this.minioClient.presignedUrl('GET', bucket, name);
  }

  async deleteFile(bucketName: string, fileName: string): Promise<void> {
    await this.minioClient.removeObject(bucketName, fileName);
  }

  private async createBucketIfNotExist(bucketName: string): Promise<void> {
    const bucketExists = await this.minioClient.bucketExists(bucketName);
    if (!bucketExists) {
      await this.minioClient.makeBucket(bucketName, 'eu-west-1');
    }
  }
}
