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

import { Inject, NotFoundException } from '@nestjs/common';
import { Message, MessageType } from 'src/core/models';
import {
    CONVERSATION_REPOSITORY,
    ConversationRepository,
} from 'src/core/ports/conversation.repository';
import {
    HASHTAG_REPOSITORY,
    HashtagRepository,
} from 'src/core/ports/hastag.repository';
import {
    MESSAGE_REPOSITORY,
    MessageRepository,
} from 'src/core/ports/message.repository';
import {
    NOTIFICATION_SERVICE,
    NotificationServicePort,
} from 'src/core/ports/notification.service';
import { UUID_PROVIDER } from 'src/core/ports/uuid.provider';
import { UuidProvider } from 'src/providers/services/uuid.provider';
const openGraphScraper = require('open-graph-scraper');

const URL_REGEX = /(https?:\/\/[^\s]+)/g;

interface CreateMessageCommand {
    content: string;
    conversationId: string;
    ownerId: string;
    originalFilename?: string;
    mimetype?: string;
    filePath?: string;
    type?: MessageType;
    parentId?: string;
}

export class CreateMessageUsecase {
    constructor(
        @Inject(CONVERSATION_REPOSITORY)
        private readonly conversationRepository: ConversationRepository,
        @Inject(MESSAGE_REPOSITORY)
        private readonly messageRepository: MessageRepository,
        @Inject(UUID_PROVIDER)
        private readonly uuidProvider: UuidProvider,
        @Inject(NOTIFICATION_SERVICE)
        private readonly notificationService: NotificationServicePort,
        @Inject(HASHTAG_REPOSITORY)
        private readonly hashtagRepository: HashtagRepository,
    ) {}

    async execute(command: CreateMessageCommand) {
        const conversation = await this.conversationRepository.findById(
            command.conversationId,
        );

        if (!conversation) {
            throw new NotFoundException('Conversation not found');
        }

        if (!conversation.usersIds.includes(command.ownerId)) {
            throw new NotFoundException('User not found in conversation');
        }

        let openGraphResult: any;
        const url = command.content
            ? command.content.match(URL_REGEX)?.[0]
            : undefined;
        if (url) {
            try {
                const result = await openGraphScraper({ url });
                if (result.result.success) {
                    openGraphResult = result.result;
                }
            } catch (err) {
                console.warn('Url not found for open graph', url);
            }
        }
        const type =
            command.type ??
            (openGraphResult
                ? MessageType.Link
                : await Message.categorizeFileType(command.mimetype));

        const message = new Message({
            id: this.uuidProvider.generate(),
            content: command.content,
            ownerId: command.ownerId,
            conversationId: command.conversationId,
            usersLiked: [],
            type,
            isReported: false,
            isDeleted: false,
            numberOfReplies: 0,
            metadata: {
                filePath: command.filePath,
                originalFilename: command.originalFilename,
                openGraphResult: openGraphResult,
            },
        });

        const createdMessage = await this.messageRepository.create(
            message,
            command.parentId,
        );

        await this.extractHashtags(conversation.id, message.content);

        await this.conversationRepository.updateLastActivityAt(conversation.id);

        if (command.parentId) {
            const parentMessage = await this.messageRepository.findById(
                command.parentId,
            );
            // If the parent message is not the same as the message owner & is a response
            // and the conversation has at least 2 users, send a notification
            if (
                parentMessage?.ownerId !== message.ownerId &&
                conversation.usersIds.length >= 2
            ) {
                this.notificationService.sendNotification(
                    message.ownerId,
                    [parentMessage.ownerId],
                    message.content,
                );
            }
        } else if (conversation.usersIds.length === 2) {
            // If the conversation has 2 users and its not a response, send a notification
            this.notificationService.sendNotification(
                message.ownerId,
                conversation.usersIds.filter((id) => id !== message.ownerId),
                message.content,
            );
        }

        return createdMessage;
    }

    private async extractHashtags(
        conversationId: string,
        content: string,
    ): Promise<void> {
        const hashtags = content.match(/#\w+/g);
        const allHashtags = hashtags
            ? hashtags.map((hashtag) => hashtag.slice(1))
            : [];

        for (const hashtag of allHashtags) {
            await this.hashtagRepository.create(conversationId, hashtag);
        }
    }
}
