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
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Query,
    Res,
    StreamableFile,
    UploadedFile,
    UseGuards,
    UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import * as Swagger from '@nestjs/swagger';
import {
    CreateConversationRequest,
    DeleteUserConversationRequest,
    GetConversationsQueryParams,
    GetMessagesQueryParams,
} from 'src/api/dtos/conversation';
import { ConversationResponse } from 'src/api/dtos/conversation/conversation.response';
import { CreateConversationsRequest } from 'src/api/dtos/conversation/create-conversations.request';
import { MessageResponse, SendMessageRequest } from 'src/api/dtos/message';
import { CollectionResponse } from 'src/api/dtos/pagination';
import { AuthenticationGuard } from 'src/api/guards';
import { MessagePaginationDirection } from 'src/core/ports/message.repository';
import {
    CreateConversationUsecase,
    CreateMessageUsecase,
    CreateMultipleConversationsUsecase,
    DeleteUserConversationUsecase,
    DeleteConversationUsecase,
    ExportMediasFromConversationUsecase,
    GetConversationFromUserIdUsecase,
    GetMessagesFromConversationIdUsecase,
    SearchMessagesIdFromConversationIdUsecase,
    UpdateConversationUsecase,
    UploadMediaUsecase,
    GetHashtagsFromConversationIdUsecase,
} from 'src/core/usecases';
import { FilePipe } from '../validators/files.validator';
import { AddUserToConversationRequest } from 'src/api/dtos/conversation/add-user-to-conversation.request';
import { HashtagResponse } from 'src/api/dtos/hashtags';

//TODO: Allow route only for rest api
@Controller('conversations')
@Swagger.ApiTags('Conversations')
export class ConversationController {
    constructor(
        private createMessageUsecase: CreateMessageUsecase,
        private createMultipleConversationsUsecase: CreateMultipleConversationsUsecase,
        private createConversationUsecase: CreateConversationUsecase,
        private deleteConversationUsecase: DeleteConversationUsecase,
        private deleteUserConversationUsecase: DeleteUserConversationUsecase,
        private getMessagesFromConversationIdUsecase: GetMessagesFromConversationIdUsecase,
        private getConversationFromUserIdUsecase: GetConversationFromUserIdUsecase,
        private getHashtagsFromConversationIdUsecase: GetHashtagsFromConversationIdUsecase,
        private searchMessagesIdFromConversationIdUsecase: SearchMessagesIdFromConversationIdUsecase,
        private uploadMediaUsecase: UploadMediaUsecase,
        private updateConversationUsecase: UpdateConversationUsecase,
        private exportMediasFromConversationUsecase: ExportMediasFromConversationUsecase,
    ) {}

    @Get('hashtags/:id')
    @Swagger.ApiOperation({ summary: 'Get all hashtags from conversation id' })
    async getHashtagsByConversationId(
        @Param('id') conversationId: string,
    ): Promise<CollectionResponse<HashtagResponse>> {
        const hashtags =
            await this.getHashtagsFromConversationIdUsecase.execute({
                id: conversationId,
            });

        return new CollectionResponse<HashtagResponse>({
            items: hashtags.map(HashtagResponse.from),
            totalItems: hashtags.length,
        });
    }

    @Get('messages/:id')
    @Swagger.ApiOperation({ summary: 'Get all messages from conversation id' })
    async getMessagesByConversationId(
        @Param('id') conversationId: string,
        @Query() params: GetMessagesQueryParams,
    ): Promise<CollectionResponse<MessageResponse>> {
        const messages =
            await this.getMessagesFromConversationIdUsecase.execute({
                id: conversationId,
                pagination: {
                    lastMessageId: params.lastMessageId,
                    limit: params.limit,
                    direction:
                        params.direction ?? MessagePaginationDirection.FORWARD,
                },
                hashtagFilter: params.hashtagFilter
                    ? `#${params.hashtagFilter}`
                    : undefined,
                typeFilter: params.typeFilter,
                parentId: params.parentId,
            });

        return new CollectionResponse<MessageResponse>({
            items: messages.map(MessageResponse.from),
            totalItems: messages.length,
        });
    }

    @Get('messages/:id/:search')
    @Swagger.ApiOperation({
        summary: 'Search all messages ids from conversation id',
    })
    async searchMessages(
        @Param('id') conversationId: string,
        @Param('search') search: string,
    ): Promise<string[]> {
        const messagesIds =
            await this.searchMessagesIdFromConversationIdUsecase.execute({
                id: conversationId,
                search: search,
            });

        return messagesIds;
    }

    @Get('/:id')
    @Swagger.ApiOperation({ summary: 'Get all conversations from id' })
    async getConversationsFromUserId(
        @Param('id') userId: string,
        @Query() query: GetConversationsQueryParams,
    ): Promise<CollectionResponse<ConversationResponse>> {
        const conversations =
            await this.getConversationFromUserIdUsecase.execute({
                id: userId,
                pagination: {
                    limit: query.limit ?? 50,
                    offset: query.offset ?? 0,
                },
                filteredProfilesIds: query.filteredProfilesIds,
            });

        return new CollectionResponse<ConversationResponse>({
            items: conversations.items.map(ConversationResponse.from),
            totalItems: conversations.totalItems,
        });
    }

    @Post('/')
    @Swagger.ApiOperation({ summary: 'Create a conversation' })
    async createConversation(
        @Body() body: CreateConversationRequest,
    ): Promise<ConversationResponse> {
        const conversation = await this.createConversationUsecase.execute({
            userIds: body.userIds,
            tandemId: body.tandemId,
            metadata: body.metadata,
        });
        return ConversationResponse.from(conversation);
    }

    @Post('/:id/add-user')
    @Swagger.ApiOperation({ summary: 'Add a user to a conversation' })
    async addUserToConversation(
        @Param('id') conversationId: string,
        @Body() body: AddUserToConversationRequest,
    ) {
        await this.updateConversationUsecase.execute({
            id: conversationId,
            usersToAdd: [body.userId],
            metadata: {},
        });
    }

    @Post('/multi')
    @Swagger.ApiOperation({ summary: 'Create some conversations' })
    async createConversations(
        @Body() body: CreateConversationsRequest,
    ): Promise<void> {
        await this.createMultipleConversationsUsecase.execute({
            conversations: body.conversations,
        });
    }

    @Delete('/:id')
    @Swagger.ApiOperation({ summary: 'Delete a conversation' })
    async deleteConversation(
        @Param('id') conversationId: string,
    ): Promise<void> {
        await this.deleteConversationUsecase.execute({ id: conversationId });
    }

    @Post('user/:id')
    @Swagger.ApiOperation({
        summary:
            'Delete all conversations from user except the ones in chatIdsToIgnore',
    })
    async deleteUserConversation(
        @Param('id') userId: string,
        @Body() body: DeleteUserConversationRequest,
    ): Promise<void> {
        await this.deleteUserConversationUsecase.execute({
            id: userId,
            chatIdsToIgnore: body.chatIdsToIgnore,
            chatIdsToLeave: body.chatIdsToLeave,
        });
    }

    @Post('/:id/message')
    @UseGuards(AuthenticationGuard)
    @UseInterceptors(FileInterceptor('file'))
    @Swagger.ApiOperation({ summary: 'Send a message' })
    async sendMessage(
        @Param('id') conversationId: string,
        @Body() body: SendMessageRequest,
        @UploadedFile(new FilePipe()) file?: Express.Multer.File,
    ): Promise<MessageResponse | undefined> {
        const message = await this.createMessageUsecase.execute({
            content: body.content,
            conversationId,
            ownerId: body.senderId,
            mimetype: file?.mimetype,
            originalFilename: body.filename,
            type: body.type,
            parentId: body.parentId,
        });

        if (file && body.filename) {
            const { name, url, thumbnailUrl } =
                await this.uploadMediaUsecase.execute({
                    file,
                    message,
                    conversationId,
                    filename: body.filename,
                });
            message.content = url;
            message.metadata.thumbnail = thumbnailUrl;
            message.metadata.filePath = name;
        }

        return MessageResponse.from(message);
    }

    @Get('/:id/export/medias')
    @Swagger.ApiOperation({ summary: 'Export all medias from conversation id' })
    async exportMediasFromConversationId(
        @Param('id') conversationId: string,
    ): Promise<StreamableFile> {
        return await this.exportMediasFromConversationUsecase.execute({
            id: conversationId,
        });
    }
}
