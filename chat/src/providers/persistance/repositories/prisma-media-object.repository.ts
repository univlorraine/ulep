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

import { PrismaService } from '@app/common';
import { Injectable } from '@nestjs/common';
import { MediaObject } from 'src/core/models/media.model';
import { MediaObjectRepository } from 'src/core/ports/media-object.repository';

@Injectable()
export class PrismaMediaObjectRepository implements MediaObjectRepository {
    constructor(private readonly prisma: PrismaService) {}

    async saveFile(object: MediaObject, messageId: string): Promise<void> {
        await this.prisma.mediaObject.create({
            data: {
                id: object.id,
                name: object.name,
                bucket: object.bucket,
                mime: object.mimetype,
                size: object.size,
                Message: { connect: { id: messageId } },
            },
        });
    }

    async saveThumbnail(object: MediaObject, messageId: string): Promise<void> {
        await this.prisma.thumbnail.create({
            data: {
                id: object.id,
                name: object.name,
                bucket: object.bucket,
                mime: object.mimetype,
                size: object.size,
                Message: { connect: { id: messageId } },
            },
        });
    }

    async findOne(id: string): Promise<MediaObject | null> {
        const result = await this.prisma.mediaObject.findUnique({
            where: { id },
        });

        if (!result) {
            return null;
        }

        return new MediaObject({
            id: result.id,
            name: result.name,
            bucket: result.bucket,
            mimetype: result.mime,
            size: result.size,
        });
    }

    async remove(id: string): Promise<void> {
        await this.prisma.mediaObject.delete({ where: { id } });
    }

    async findAllByConversationId(
        conversationId: string,
    ): Promise<MediaObject[]> {
        const medias = await this.prisma.mediaObject.findMany({
            where: { Message: { Conversation: { id: conversationId } } },
        });

        if (!medias) {
            return [];
        }

        return medias.map(
            (media) =>
                new MediaObject({
                    id: media.id,
                    name: media.name,
                    bucket: media.bucket,
                    mimetype: media.mime,
                    size: media.size,
                }),
        );
    }
}
