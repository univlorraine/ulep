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

import { RedisService } from '@app/common';
import { Injectable } from '@nestjs/common';
import { RoomRepositoryInterface, Room } from 'src/core/ports/room.repository';

// Topics are stored at conversation:{conversation} with User IDs.
// Users are stored as user:{userId} which returns the socketId for quicker access.
@Injectable()
export class RedisRoomService implements RoomRepositoryInterface {
    constructor(private readonly redis: RedisService) {}

    // Add user to a conversation
    async addUserToTopic(conversation: string, userId: string): Promise<void> {
        await this.redis.client.sAdd(`conversation:${conversation}`, userId);
    }

    // Remove user from a conversation
    async removeUserFromTopic(
        conversation: string,
        userId: string,
    ): Promise<void> {
        await this.redis.client.sRem(`conversation:${conversation}`, userId);
    }

    // Remove user from all conversations
    async removeUserFromAllTopics(userId: string): Promise<void> {
        const conversationKeys = await this.redis.client.keys('conversation:*');

        for (const key of conversationKeys) {
            await this.redis.client.sRem(key, userId);
        }
    }

    // Save user's socket ID
    async setUserSocketId(userId: string, socketId: string): Promise<void> {
        await this.redis.client.set(`user:${userId}`, socketId);
    }

    // Fetch user socketID using their userID
    async getUserSocketId(userId: string): Promise<string | null> {
        return await this.redis.client.get(`user:${userId}`);
    }

    // Delete a user's socket ID
    async deleteUserSocketId(userId: string): Promise<void> {
        await this.redis.client.del(`user:${userId}`);
    }

    // Fetch all conversations with their participants (user IDs)
    async findConversationsWithParticipants(): Promise<Room[]> {
        const conversationKeys = await this.redis.client.keys('conversation:*');
        const rooms = [];

        for (const key of conversationKeys) {
            const conversation = key.split(':')[1];
            const participants = await this.redis.client.sMembers(key);
            rooms.push({ conversation, participants });
        }

        return rooms;
    }

    // Find participants by conversation
    async findParticipantsByConversationId(
        conversationId: string,
    ): Promise<Room | null> {
        const participants = await this.redis.client.sMembers(
            `conversation:${conversationId}`,
        );

        return participants.length ? { conversationId, participants } : null;
    }
}
