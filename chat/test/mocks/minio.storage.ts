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
        return `${bucket}/${name}`;
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

    async deleteBucketContents(bucket: string): Promise<void> {
        this.logger.debug('Delete bucket contents', bucket);
    }
}
