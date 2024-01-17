import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { File, StorageInterface } from 'src/core/ports/storage.interface';
import { Readable } from 'stream';
import { Env } from 'src/configuration';
import {
  CreateBucketCommand,
  DeleteObjectCommand,
  GetObjectCommand,
  HeadBucketCommand,
  HeadObjectCommand,
  PutObjectCommand,
  S3Client,
  S3ServiceException,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

@Injectable()
export class MinioStorage implements StorageInterface {
  #client: S3Client;

  constructor(env: ConfigService<Env, true>) {
    this.#client = new S3Client({
      endpoint: env.get('S3_URL'),
      region: env.get('S3_REGION'),
      credentials: {
        accessKeyId: env.get('S3_ACCESS_KEY'),
        secretAccessKey: env.get('S3_ACCESS_SECRET'),
      },
      forcePathStyle: true,
    });
  }

  async read(bucket: string, filename: string): Promise<Readable> {
    const command = new GetObjectCommand({ Bucket: bucket, Key: filename });
    const response = await this.#client.send(command);

    if (response.Body instanceof Readable) {
      return response.Body;
    }

    throw new Error('No response body was provided');
  }

  async write(bucket: string, name: string, file: File): Promise<void> {
    const bucketExists = await this.directoryExists(bucket);
    if (!bucketExists) {
      await this.createDirectory(bucket);
    }

    const command = new PutObjectCommand({
      Bucket: bucket,
      Key: name,
      Body: file.buffer,
      ContentType: file.mimetype,
      ContentLength: file.size,
      ACL: 'private',
    });

    await this.#client.send(command);
  }

  async delete(bucket: string, name: string): Promise<void> {
    const bucketExists = await this.directoryExists(bucket);
    if (!bucketExists) {
      return;
    }

    const command = new DeleteObjectCommand({ Bucket: bucket, Key: name });

    await this.#client.send(command);
  }

  // eslint-disable-next-line prettier/prettier
  async temporaryUrl(bucket: string, name: string, expiry: number): Promise<string> {
    const command = new GetObjectCommand({ Bucket: bucket, Key: name });

    return getSignedUrl(this.#client, command, { expiresIn: expiry });
  }

  async fileExists(bucket: string, name: string): Promise<boolean> {
    try {
      const command = new HeadObjectCommand({ Bucket: bucket, Key: name });
      await this.#client.send(command);

      return true;
    } catch (e) {
      // eslint-disable-next-line prettier/prettier
      if (e instanceof S3ServiceException && e.$metadata.httpStatusCode === 404) {
        return false;
      }

      throw e;
    }
  }

  async directoryExists(bucket: string): Promise<boolean> {
    const command = new HeadBucketCommand({ Bucket: bucket });
    try {
      await this.#client.send(command);
      return true;
    } catch (error) {
      return false;
    }
  }

  async createDirectory(directory: string): Promise<void> {
    const command = new CreateBucketCommand({
      Bucket: directory,
      ACL: 'private',
    });
    await this.#client.send(command);
  }
}
