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

import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Message, MessageType } from 'src/core/models';
import {
    CONVERSATION_REPOSITORY,
    ConversationRepository,
} from 'src/core/ports/conversation.repository';
import {
    MESSAGE_REPOSITORY,
    MessagePagination,
    MessageRepository,
} from 'src/core/ports/message.repository';
import {
    STORAGE_INTERFACE,
    StorageInterface,
} from 'src/core/ports/storage.interface';

export class GetMessagesFromConversationIdCommand {
    id: string;
    pagination: MessagePagination;
    hashtagFilter: string;
    typeFilter: MessageType;
    parentId?: string;
}

@Injectable()
export class GetMessagesFromConversationIdUsecase {
    constructor(
        @Inject(CONVERSATION_REPOSITORY)
        private readonly conversationRepository: ConversationRepository,
        @Inject(MESSAGE_REPOSITORY)
        private readonly messageRepository: MessageRepository,
        @Inject(STORAGE_INTERFACE)
        private readonly storage: StorageInterface,
    ) {}

    async execute(command: GetMessagesFromConversationIdCommand) {
        const conversation = await this.conversationRepository.findById(
            command.id,
        );

        if (!conversation) {
            throw new NotFoundException('Conversation not found');
        }

        let messages: Message[];

        if (!command.parentId) {
            messages =
                await this.messageRepository.findMessagesByConversationId(
                    command.id,
                    command.pagination,
                    command.hashtagFilter,
                    command.typeFilter,
                );
        } else {
            // If we are in a thread, we only want to get the messages from the thread
            messages = await this.messageRepository.findResponsesByMessageId(
                command.parentId,
                command.pagination,
            );
        }

        for (const message of messages) {
            await this.handleMediaMessage(message);
            if (message.parent) {
                await this.handleMediaMessage(message.parent);
            }
        }

        return messages;
    }

    async handleMediaMessage(message: Message) {
        if (
            (message.type === MessageType.Image ||
                message.type === MessageType.Audio ||
                message.type === MessageType.File) &&
            message.content
        ) {
            message.metadata.filePath = message.content;
            message.content = await this.storage.temporaryUrl(
                'chat',
                message.content,
                3600,
            );

            if (
                message.type === MessageType.Image &&
                message.metadata.thumbnail
            ) {
                message.metadata.thumbnail = await this.storage.temporaryUrl(
                    'chat',
                    message.metadata.thumbnail,
                    3600,
                );
            }
        }
    }
}
