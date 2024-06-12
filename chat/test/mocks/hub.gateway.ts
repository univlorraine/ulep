import {
    OnGatewayConnection,
    OnGatewayDisconnect,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';
import { Message } from 'src/core/models';

@WebSocketGateway(0, {
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

    constructor() {
        this.logger.debug('HubGateway instantiated');
    }

    /**
     * Add user to all conversations he is registered to when he connects.
     */
    async handleConnection(socket: Socket) {
        this.logger.debug('User connected');
    }

    /**
     * Remove user from all conversations he is registered to when he disconnects.
     */
    async handleDisconnect(socket: Socket) {
        this.logger.debug('User disconnected');
    }

    /**
     * Publish an update to a specific conversation.
     */
    @SubscribeMessage('publish')
    publish(client: Socket, message: Message): void {
        this.logger.debug('Publish message', message);
    }

    /**
     * Add user to a conversation.
     */
    async subscribe(conversation: string, user: string): Promise<void> {
        this.logger.debug('Subscribe to conversation', conversation, user);
    }

    /**
     * Remove user from a conversation.
     */
    async unsubscribe(conversation: string, user: string): Promise<void> {
        this.logger.debug('Unsubscribe from conversation', conversation, user);
    }
}
