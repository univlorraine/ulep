/**
 *
 *   Copyright ou © ou Copr. Université de Lorraine, (2025)
 *
 *   Direction du Numérique de l'Université de Lorraine - SIED
 *
 *   Ce logiciel est un programme informatique servant à rendre accessible
 *   sur mobile et sur internet l'application ULEP (University Language
 *   Exchange Programme) aux étudiants et aux personnels des universités
 *   parties prenantes.
 *
 *   Ce logiciel est régi par la licence CeCILL 2.1, soumise au droit français
 *   et respectant les principes de diffusion des logiciels libres. Vous pouvez
 *   utiliser, modifier et/ou redistribuer ce programme sous les conditions
 *   de la licence CeCILL telle que diffusée par le CEA, le CNRS et INRIA
 *   sur le site "http://cecill.info".
 *
 *   En contrepartie de l'accessibilité au code source et des droits de copie,
 *   de modification et de redistribution accordés par cette licence, il n'est
 *   offert aux utilisateurs qu'une garantie limitée. Pour les mêmes raisons,
 *   seule une responsabilité restreinte pèse sur l'auteur du programme, le
 *   titulaire des droits patrimoniaux et les concédants successifs.
 *
 *   À cet égard, l'attention de l'utilisateur est attirée sur les risques
 *   associés au chargement, à l'utilisation, à la modification et/ou au
 *   développement et à la reproduction du logiciel par l'utilisateur étant
 *   donné sa spécificité de logiciel libre, qui peut le rendre complexe à
 *   manipuler et qui le réserve donc à des développeurs et des professionnels
 *   avertis possédant des connaissances informatiques approfondies. Les
 *   utilisateurs sont donc invités à charger et à tester l'adéquation du
 *   logiciel à leurs besoins dans des conditions permettant d'assurer la
 *   sécurité de leurs systèmes et/ou de leurs données et, plus généralement,
 *   à l'utiliser et à l'exploiter dans les mêmes conditions de sécurité.
 *
 *   Le fait que vous puissiez accéder à cet en-tête signifie que vous avez
 *   pris connaissance de la licence CeCILL 2.1, et que vous en avez accepté les
 *   termes.
 *
 */

import {
    CreateBucketCommand,
    DeleteObjectCommand,
    DeleteObjectsCommand,
    GetObjectCommand,
    HeadBucketCommand,
    HeadObjectCommand,
    ListObjectsCommand,
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
            const command = new HeadObjectCommand({
                Bucket: bucket,
                Key: name,
            });
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

    public async deleteBucketContents(bucket: string): Promise<void> {
        const bucketExists = await this.directoryExists(bucket);
        if (!bucketExists) {
            this.#logger.error(`Bucket ${bucket} does not exist.`);
            return;
        }

        await this.deleteAllObjectsInBucket(bucket);
    }

    private async deleteAllObjectsInBucket(bucket: string): Promise<void> {
        const listObjectsCommand = new ListObjectsCommand({ Bucket: bucket });
        const { Contents } = await this.#client.send(listObjectsCommand);

        if (Contents && Contents.length > 0) {
            const deleteParams = {
                Bucket: bucket,
                Delete: {
                    Objects: Contents.map(({ Key }) => ({ Key })),
                    Quiet: false,
                },
            };
            const deleteObjectsCommand = new DeleteObjectsCommand(deleteParams);
            await this.#client.send(deleteObjectsCommand);
        }
    }
}
