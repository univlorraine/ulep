import {
    OnGatewayConnection,
    OnGatewayDisconnect,
    WebSocketGateway,
    WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Inject, Logger } from '@nestjs/common';
import { Message } from 'src/core/models';
import {
    CONVERSATION_REPOSITORY,
    ConversationRepository,
} from 'src/core/ports/conversation.repository';
import { RedisRoomService } from 'src/providers/services/room.service';
import { ROOM_REPOSITORY } from 'src/core/ports/room.repository';
import { KeycloakClient } from '@app/keycloak';

@WebSocketGateway(5000, {
    cors: {
        origin: '*',
        methods: ['GET'],
    },
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
        @Inject(ROOM_REPOSITORY) private readonly roomService: RedisRoomService,
        private readonly keycloakClient: KeycloakClient,
    ) {
        this.logger.debug('HubGateway instantiated');
    }

    /**
     * Add user to all conversations he is registered to when he connects.
     */
    async handleConnection(socket: Socket) {
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
                    conversations.map((conversation) => conversation.id),
                );
            // Save user socket id.
            this.roomService.setUserSocketId(user, socket.id);
            // Save user to all conversations he is registered to.
            for (const conversation of conversations) {
                this.roomService.addUserToTopic(conversation.id, user);
            }
        } else {
            socket.disconnect();
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
    publish(update: Message): void {
        this.server.to(update.conversationId).emit('*', update);
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
