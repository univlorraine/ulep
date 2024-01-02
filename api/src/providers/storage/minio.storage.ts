import * as Minio from 'minio';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { File, StorageInterface } from 'src/core/ports/storage.interface';
import { ContentTypeException } from 'src/core/errors/content-type.exception';
import { Readable } from 'stream';

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
      endPoint: configService.get('MINIO_HOST') || 'minio',
      port: Number(configService.get('MINIO_PORT')) || null,
      useSSL: 'true' === configService.get('MINIO_USE_SSL'),
      accessKey: configService.get('MINIO_ACCESS_KEY'),
      secretKey: configService.get('MINIO_SECRET_KEY'),
    });
  }

  async uploadFile(bucket: string, name: string, file: File): Promise<void> {
    // Check if content type is allowed
    const allowedContentTypes = ['image/jpeg', 'image/png'];
    if (!allowedContentTypes.includes(file.mimetype)) {
      throw new ContentTypeException(file.mimetype);
    }

    // Create bucket with policies if not exists
    const bucketExists = await this.minioClient.bucketExists(bucket);
    if (!bucketExists) {
      await this.createBucket(bucket);
    }

    await this.minioClient.putObject(bucket, name, file.buffer, file.size);
  }

  async generatePresignedUrl(
    bucket: string,
    name: string,
    expiry: number,
  ): Promise<string> {
    return this.minioClient.presignedUrl('GET', bucket, name, expiry);
  }

  async deleteFile(bucketName: string, fileName: string): Promise<void> {
    await this.minioClient.removeObject(bucketName, fileName);
  }

  private async createBucket(bucketName: string): Promise<void> {
    await this.minioClient.makeBucket(bucketName, 'eu-west-1');
  }

  private async addPolicyToBucket(
    bucket: string,
    actions: ('s3:GetObject' | 's3:PutObject' | 's3:DeleteObject')[],
  ) {
    await this.minioClient.setBucketPolicy(
      bucket,
      JSON.stringify({
        Version: '2012-10-17',
        Statement: [
          {
            Effect: 'Allow',
            Principal: { AWS: '*' },
            Action: actions,
            Resource: [`arn:aws:s3:::${bucket}/*`],
          },
        ],
      }),
    );
  }

  async getObject(bucket: string, filename: string): Promise<Readable> {
    return this.minioClient.getObject(bucket, filename);
  }
}
