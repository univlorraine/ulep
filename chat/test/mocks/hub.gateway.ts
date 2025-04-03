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
