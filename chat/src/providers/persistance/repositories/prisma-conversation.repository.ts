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

import { Collection, PrismaService } from '@app/common';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { Conversation } from 'src/core/models';
import { MediaObject } from 'src/core/models/media.model';
import {
    ConversationPagination,
    ConversationRepository,
    CreateConversations,
} from 'src/core/ports/conversation.repository';
import {
    ConversationRelations,
    conversationMapper,
} from 'src/providers/persistance/mappers';

@Injectable()
export class PrismaConversationRepository implements ConversationRepository {
    constructor(private readonly prisma: PrismaService) {}

    async findById(conversationId: string): Promise<Conversation> {
        const conversation = await this.prisma.conversation.findUnique({
            where: { id: conversationId },
            ...ConversationRelations,
        });

        if (!conversation) {
            return null;
        }

        return conversationMapper(conversation);
    }

    async findByUserId(
        userId: string,
        pagination?: ConversationPagination,
        filteredProfilesIds?: string[],
    ): Promise<Collection<Conversation>> {
        const conversationPagination: Prisma.ConversationFindManyArgs = {
            take: undefined,
            skip: undefined,
        };
        if (pagination?.limit) {
            conversationPagination.take = pagination.limit;
        }

        if (pagination?.offset) {
            conversationPagination.skip = pagination.offset;
        }

        let where: any = {
            participantIds: { has: userId },
        };

        if (filteredProfilesIds) {
            where = {
                AND: [
                    { participantIds: { has: userId } },
                    {
                        OR: filteredProfilesIds
                            .filter(
                                (filteredUserId) => filteredUserId !== userId,
                            )
                            .map((id) => ({
                                participantIds: { has: id },
                            })),
                    },
                ],
            };
        }

        const count = await this.prisma.conversation.count({ where });

        const conversations = await this.prisma.conversation.findMany({
            where: where,
            orderBy: [
                {
                    lastActivityAt: 'desc',
                },
                {
                    createdAt: 'desc',
                },
            ],
            distinct: ['id'],
            include: {
                Messages: {
                    take: 1,
                    orderBy: {
                        createdAt: 'desc',
                    },
                    where: {
                        ParentMessage: null,
                        isDeleted: false,
                    },
                },
            },
            ...conversationPagination,
        });

        return new Collection<Conversation>({
            items: conversations.map(conversationMapper),
            totalItems: count,
        });
    }

    async create(
        id: string,
        usersIds: string[],
        metadata: any,
    ): Promise<Conversation> {
        const conversation = await this.prisma.conversation.create({
            data: {
                id,
                participantIds: usersIds,
                metadata: metadata,
            },
            ...ConversationRelations,
        });

        return conversationMapper(conversation);
    }

    async findConversationsByIdsOrParticipants(
        ids: string[],
        participantsGroup: string[][],
    ): Promise<Conversation[]> {
        const existingConversations = await this.prisma.conversation.findMany({
            where: {
                OR: [
                    { id: { in: ids } },
                    ...participantsGroup.map((participants) => ({
                        OR: participants.map((participant) => ({
                            participantIds: { has: participant },
                        })),
                    })),
                ],
            },
            ...ConversationRelations,
        });

        if (!existingConversations) {
            return [];
        }

        return existingConversations.map(conversationMapper);
    }

    async createConversations(
        conversations: CreateConversations[],
    ): Promise<void> {
        await this.prisma.conversation.createMany({
            data: conversations.map((conversation) => ({
                participantIds: conversation.participants,
                id: conversation.tandemId,
            })),
        });
    }

    async delete(id: string): Promise<void> {
        await this.prisma.conversation.delete({ where: { id } });
    }

    async deleteAll(): Promise<void> {
        await this.prisma.conversation.deleteMany();
    }

    async update(
        id: string,
        usersIds: string[],
        metadata: any,
    ): Promise<Conversation> {
        const conversation = await this.prisma.conversation.update({
            where: { id },
            data: { participantIds: usersIds, metadata },
            ...ConversationRelations,
        });

        return conversationMapper(conversation);
    }

    async updateLastActivityAt(conversationId: string): Promise<void> {
        await this.prisma.conversation.update({
            where: { id: conversationId },
            data: { lastActivityAt: new Date() },
        });
    }
}
