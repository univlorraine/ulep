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

import { Collection } from '@app/common';
import { Injectable } from '@nestjs/common';
import { Conversation } from 'src/core/models/conversation.model';
import {
    ConversationRepository,
    CreateConversations,
} from 'src/core/ports/conversation.repository';

@Injectable()
export class InMemoryConversationRepository implements ConversationRepository {
    #conversations: Conversation[] = [];

    get conversations(): Conversation[] {
        return this.#conversations;
    }

    init(conversations: Conversation[]): void {
        this.#conversations = conversations;
    }

    reset(): void {
        this.#conversations = [];
    }

    async all(): Promise<Collection<Conversation>> {
        return {
            items: this.#conversations,
            totalItems: this.#conversations.length,
        };
    }

    async findById(id: string): Promise<Conversation> {
        return this.#conversations.find(
            (conversation) => conversation.id === id,
        );
    }

    async findByUserId(userId: string): Promise<Collection<Conversation>> {
        const conversations = this.#conversations.filter((conversation) =>
            conversation.usersIds.includes(userId),
        );

        return new Collection<Conversation>({
            items: conversations,
            totalItems: conversations.length,
        });
    }

    async findConversationsByIdsOrParticipants(
        ids: string[],
        participants: string[][],
    ): Promise<Conversation[]> {
        return this.#conversations.filter(
            (conversation) =>
                ids.includes(conversation.id) ||
                participants.some((participant) =>
                    conversation.usersIds.every((user) =>
                        participant.includes(user),
                    ),
                ),
        );
    }

    create(
        id: string,
        usersIds: string[],
        metadata: any,
    ): Promise<Conversation> {
        const conversation = new Conversation({
            id,
            usersIds,
            metadata,
            createdAt: new Date(),
            lastActivity: new Date(),
        });
        this.#conversations.push(conversation);
        return Promise.resolve(conversation);
    }

    async update(
        conversationId: string,
        usersIds: string[],
        metadata: any,
    ): Promise<Conversation> {
        const index = this.#conversations.findIndex(
            (conv) => conv.id === conversationId,
        );

        const updatedConversation = new Conversation({
            id: conversationId,
            usersIds,
            metadata,
            createdAt: new Date(),
            lastActivity: new Date(),
        });

        if (index === -1) {
            return Promise.reject(null);
        }

        this.#conversations[index] = updatedConversation;

        return Promise.resolve(updatedConversation);
    }

    async updateLastActivityAt(conversationId: string): Promise<void> {
        return;
    }

    delete(id: string): Promise<void> {
        const index = this.#conversations.findIndex(
            (conversation) => conversation.id === id,
        );

        if (index !== -1) {
            this.#conversations.splice(index, 1);
        }

        return Promise.resolve();
    }

    deleteAll(): Promise<void> {
        this.#conversations = [];
        return Promise.resolve();
    }

    createConversations(conversations: CreateConversations[]): Promise<void> {
        this.#conversations = conversations.map((conversation) => ({
            id: conversation.tandemId,
            usersIds: conversation.participants,
            metadata: {},
            createdAt: new Date(),
            lastActivity: new Date(),
        }));
        return Promise.resolve();
    }
}
