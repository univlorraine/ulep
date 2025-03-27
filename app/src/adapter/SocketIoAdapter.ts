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

import socketIo, { Socket } from 'socket.io-client';
import { Message, MessageWithConversationId } from '../domain/entities/chat/Message';
import { UserChat } from '../domain/entities/User';
import SocketIoAdapterInterface from './interfaces/SocketIoAdapter.interface';

class SocketIoAdapter implements SocketIoAdapterInterface {
    private chatUrl: string;
    private socket: Socket | null = null;

    constructor(chatUrl: string) {
        this.chatUrl = chatUrl;
    }

    isConnected(): boolean {
        return this.socket?.connected ?? false;
    }

    connect(accessToken: string): void {
        if (this.socket && this.socket.connected) {
            return;
        }
        this.socket = socketIo(this.chatUrl, { auth: { token: accessToken } });
    }

    disconnect(): void {
        if (this.socket && this.socket.connected) {
            this.socket.disconnect();
        }
    }

    onDisconnect(handler: () => void): void {
        this.socket!.on('disconnect', handler);
    }

    emit(message: Message): Message {
        this.socket?.emit('publish', message);
        return message;
    }

    like(conversationId: string, messageId: string, userId: string): void {
        this.socket?.emit('like', conversationId, messageId, userId);
    }

    unlike(conversationId: string, messageId: string, userId: string): void {
        this.socket?.emit('unlike', conversationId, messageId, userId);
    }

    onLiked(currentConversationId: string, handler: (messageId: string, userId: string) => void): void {
        this.socket!.on('liked', (conversationId: string, messageId: string, userId: string) => {
            if (conversationId !== currentConversationId) {
                return;
            }

            handler(messageId, userId);
        });
    }

    onUnliked(currentConversationId: string, handler: (messageId: string, userId: string) => void): void {
        this.socket!.on('unliked', (conversationId: string, messageId: string, userId: string) => {
            if (conversationId !== currentConversationId) {
                return;
            }

            handler(messageId, userId);
        });
    }

    onMessage(conversationId: string, handler: (message: Message) => void): void {
        //TODO: Later if asked we can call antoher function to update the last message conversation through this
        //TODO: If not conversationId then call the handler for other conversation that will call an injected function to parent
        //TODO: that will update ConversationContent ( WEB ONLY )
        this.socket!.on('message', (message: MessageWithConversationId) => {
            if (conversationId !== message.conversationId) {
                return;
            }

            handler(
                new Message(
                    message.id,
                    message.content,
                    new Date(message.createdAt),
                    new UserChat(
                        message.sender.id,
                        message.sender.firstname,
                        message.sender.lastname,
                        message.sender.email,
                        false,
                        message.sender.avatar
                    ),
                    message.type,
                    0,
                    false,
                    message.metadata,
                    0,
                    false,
                    message.parentId
                )
            );
        });
    }

    offMessage(): void {
        this.socket!.off('message');
    }

    offDisconnect(): void {
        this.socket!.off('disconnect');
    }

    offLike(): void {
        this.socket!.off('liked');
    }

    offUnlike(): void {
        this.socket!.off('unliked');
    }
}

export default SocketIoAdapter;
