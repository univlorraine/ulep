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
import { Hashtag } from 'src/core/models';
import { HashtagRepository } from 'src/core/ports/hastag.repository';
import { hashtagMapper } from 'src/providers/persistance/mappers/hastag.mapper';
import { startOfDay, endOfDay } from 'date-fns';

@Injectable()
export class PrismaHashtagRepository implements HashtagRepository {
    constructor(private readonly prisma: PrismaService) {}

    async create(conversationId: string, name: string): Promise<void> {
        await this.prisma.hashtag.create({
            data: { Conversation: { connect: { id: conversationId } }, name },
        });
    }

    async findAllByConversationId(conversationId: string): Promise<Hashtag[]> {
        const todayStart = startOfDay(new Date());
        const todayEnd = endOfDay(new Date());

        const hashtags = await this.prisma.hashtag.findMany({
            where: {
                Conversation: { id: conversationId },
                created_at: {
                    gte: todayStart,
                    lte: todayEnd,
                },
            },
            select: { name: true },
        });

        const hashtagCount: Record<string, number> = hashtags.reduce(
            (acc: Record<string, number>, { name }) => {
                acc[name] = (acc[name] || 0) + 1;
                return acc;
            },
            {},
        );

        // Trier les hashtags par fréquence et prendre les 10 premiers
        const topHashtags = Object.entries(hashtagCount)
            .sort(([, countA], [, countB]) => countB - countA)
            .slice(0, 10)
            .map(([name, count]) => hashtagMapper(name, count));

        return topHashtags;
    }
}
