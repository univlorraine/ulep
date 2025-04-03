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

import { KeycloakClient } from '@app/keycloak';
import { Inject, Logger } from '@nestjs/common';
import {
    OnGatewayConnection,
    OnGatewayDisconnect,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Message } from 'src/core/models';
import {
    CONVERSATION_REPOSITORY,
    ConversationRepository,
} from 'src/core/ports/conversation.repository';
import {
    MESSAGE_REPOSITORY,
    MessageRepository,
} from 'src/core/ports/message.repository';
import { ROOM_REPOSITORY } from 'src/core/ports/room.repository';
import { RedisRoomService } from 'src/providers/services/room.service';

@WebSocketGateway(5000, {
    cors: true,
})
export class HubGateway
    implements OnGatewayConnection, OnGatewayDisconnect, HubGateway
{
    private readonly logger = new Logger(HubGateway.name);

    @WebSocketServer()
    private readonly server: Server;

    constructor(
        @Inject(CONVERSATION_REPOSITORY)
        private readonly conversationRepository: ConversationRepository,
        @Inject(MESSAGE_REPOSITORY)
        private readonly messageRepository: MessageRepository,
        @Inject(ROOM_REPOSITORY) private readonly roomService: RedisRoomService,
        private readonly keycloakClient: KeycloakClient,
    ) {
        this.logger.debug('HubGateway instantiated');
    }

    /**
     * Add user to all conversations he is registered to when he connects.
     */
    async handleConnection(socket: Socket) {
        try {
            const user = await this.computeUserIdFromToken(
                socket.handshake.auth.token,
            );

            if (user) {
                // Find all conversations the user is registered to.
                const conversations =
                    await this.conversationRepository.findByUserId(user);
                // Join user to all conversations he is registered to.

                this.server
                    .in(socket.id)
                    .socketsJoin(
                        conversations.items.map(
                            (conversation) => conversation.id,
                        ),
                    );
                // Save user socket id.
                this.roomService.setUserSocketId(user, socket.id);
                // Save user to all conversations he is registered to.
                for (const conversation of conversations.items) {
                    this.roomService.addUserToTopic(conversation.id, user);
                }
            } else {
                socket.disconnect();
            }
        } catch (error) {
            socket.disconnect();
            console.error(error);
        }
    }

    /**
     * Remove user from all conversations he is registered to when he disconnects.
     */
    async handleDisconnect(socket: Socket) {
        // Remove user from all conversations he is registered to.
        await this.roomService.removeUserFromAllTopics(socket.id);
        // Delete user socket id.
        await this.roomService.deleteUserSocketId(socket.id);
    }

    /**
     * Publish an update to a specific conversation.
     */
    @SubscribeMessage('publish')
    publish(client: Socket, message: Message): void {
        this.server
            .to(message.conversationId)
            .timeout(1000)
            .emit('message', message);
    }

    /**
     * Publish an update to a specific conversation.
     */
    @SubscribeMessage('like')
    async like(client: Socket, ids: string[]): Promise<void> {
        const conversationId = ids[0];
        const messageId = ids[1];
        const userId = ids[2];
        await this.messageRepository.like(messageId, userId);
        this.server
            .to(conversationId)
            .timeout(1000)
            .emit('liked', conversationId, messageId, userId);
    }

    /**
     * Publish an update to a specific conversation.
     */
    @SubscribeMessage('unlike')
    async unlike(client: Socket, ids: string[]): Promise<void> {
        const conversationId = ids[0];
        const messageId = ids[1];
        const userId = ids[2];
        await this.messageRepository.unlike(messageId, userId);
        this.server
            .to(conversationId)
            .timeout(1000)
            .emit('unliked', conversationId, messageId, userId);
    }

    /**
     * Add user to a conversation.
     */
    async subscribe(conversation: string, user: string): Promise<void> {
        const socket = await this.roomService.getUserSocketId(user);
        if (socket) {
            // Join user to socket.
            this.server.in(socket).socketsJoin(conversation);
            // Save user registration.
            this.roomService.addUserToTopic(conversation, user);
        }
    }

    /**
     * Remove user from a conversation.
     */
    async unsubscribe(conversation: string, user: string): Promise<void> {
        const socket = await this.roomService.getUserSocketId(user);
        if (socket) {
            // Leave user from socket.
            this.server.in(socket).socketsLeave(conversation);
            // Remove user registration.
            this.roomService.removeUserFromTopic(conversation, user);
        }
    }

    /**
     * Return user id from authentication token.
     */
    private async computeUserIdFromToken(token: string): Promise<string> {
        return (await this.keycloakClient.authenticate(token)).sub;
    }
}
