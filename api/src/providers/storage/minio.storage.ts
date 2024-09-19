import {
  CreateBucketCommand,
  DeleteObjectCommand,
  GetObjectCommand,
  HeadBucketCommand,
  HeadObjectCommand,
  PutBucketPolicyCommand,
  PutObjectCommand,
  S3Client,
  S3ServiceException,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Env } from 'src/configuration';
import { File, StorageInterface } from 'src/core/ports/storage.interface';
import { Readable } from 'stream';

@Injectable()
export class MinioStorage implements StorageInterface {
  #logger = new Logger(MinioStorage.name);

  #client: S3Client;

  constructor(env: ConfigService<Env, true>) {
    this.#client = new S3Client({
      endpoint: env.get('S3_URL'),
      region: env.get('S3_REGION'),
      runtime: 'node',
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
      await this.makeBucketPrivate(bucket);
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
    if (
      !(await this.directoryExists(bucket)) ||
      !(await this.fileExists(bucket, name))
    ) {
      return;
    }

    const command = new DeleteObjectCommand({ Bucket: bucket, Key: name });

    await this.#client.send(command);
  }

  async temporaryUrl(
    bucket: string,
    name: string,
    expiry: number,
  ): Promise<string> {
    const command = new GetObjectCommand({ Bucket: bucket, Key: name });

    return getSignedUrl(this.#client, command, { expiresIn: expiry });
  }

  async fileExists(bucket: string, name: string): Promise<boolean> {
    try {
      const command = new HeadObjectCommand({ Bucket: bucket, Key: name });
      await this.#client.send(command);

      return true;
    } catch (e) {
      if (
        e instanceof S3ServiceException &&
        e.$metadata.httpStatusCode === 404
      ) {
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

  private async makeBucketPrivate(bucket: string): Promise<void> {
    const command = new PutBucketPolicyCommand({
      Bucket: bucket,
      Policy: JSON.stringify({
        Version: '2012-10-17',
        Statement: [],
      }),
    });

    try {
      await this.#client.send(command);
    } catch (err) {
      this.#logger.error(err);
    }
  }
}
