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
import * as sharp from 'sharp';
import { Message } from 'src/core/models';
import { MediaObject } from 'src/core/models/media.model';
import {
    CONVERSATION_REPOSITORY,
    ConversationRepository,
} from 'src/core/ports/conversation.repository';
import {
    MESSAGE_REPOSITORY,
    MessageRepository,
} from 'src/core/ports/message.repository';
import {
    MEDIA_OBJECT_REPOSITORY,
    MediaObjectRepository,
} from '../../ports/media-object.repository';
import {
    File,
    STORAGE_INTERFACE,
    StorageInterface,
} from '../../ports/storage.interface';

export class UploadMediaCommand {
    conversationId: string;
    message: Message;
    file: File;
    filename: string;
}

@Injectable()
export class UploadMediaUsecase {
    constructor(
        @Inject(MESSAGE_REPOSITORY)
        private readonly messageRepository: MessageRepository,
        @Inject(CONVERSATION_REPOSITORY)
        private readonly conversationRepository: ConversationRepository,
        @Inject(STORAGE_INTERFACE)
        private readonly storageInterface: StorageInterface,
        @Inject(MEDIA_OBJECT_REPOSITORY)
        private readonly mediaObjectRepository: MediaObjectRepository,
    ) {}

    async execute(command: UploadMediaCommand) {
        await this.assetConversationExist(command.conversationId);
        await this.assetMessageExist(command.message.id);

        const { name, url } = await this.upload(
            command.file,
            command.conversationId,
            command.message,
            command.filename,
        );

        let thumbnailUrl = null;
        if (command.file.mimetype.startsWith('image/')) {
            thumbnailUrl = await this.uploadThumbnail(
                command.file,
                command.conversationId,
                command.message,
                command.filename,
            );
        }

        return {
            name,
            url,
            thumbnailUrl,
        };
    }

    private async upload(
        file: Express.Multer.File,
        conversationId: string,
        message: Message,
        filename: string,
    ): Promise<{ name: string; url: string }> {
        const media = MediaObject.generate(
            file,
            'chat',
            conversationId,
            filename,
        );
        await this.storageInterface.write('chat', media.name, file);
        await this.mediaObjectRepository.saveFile(media, message.id);

        return {
            name: media.name,
            url: await this.storageInterface.temporaryUrl(
                'chat',
                media.name,
                3600,
            ),
        };
    }

    private async uploadThumbnail(
        file: Express.Multer.File,
        conversationId: string,
        message: Message,
        filename: string,
    ): Promise<string | null> {
        const load = await sharp(file.buffer);
        const metadata = await load.metadata();
        const height = metadata.height;
        const width = metadata.width;
        if (height > 600 || width > 600) {
            const resizedBuffer = await sharp(file.buffer)
                .resize({
                    width: width > height ? 600 : null,
                    height: height > width ? 600 : null,
                    fit: 'inside',
                }) // Reduce proportionally
                .toBuffer();

            const thumbnailFile: Express.Multer.File = {
                fieldname: file.fieldname,
                originalname: file.originalname,
                encoding: file.encoding,
                mimetype: file.mimetype,
                size: resizedBuffer.length,
                buffer: resizedBuffer,
                destination: file.destination,
                filename: `thumbnail_${filename}`,
                path: file.path,
                stream: file.stream,
            };
            const thumbnail = MediaObject.generate(
                thumbnailFile,
                'chat',
                conversationId,
                filename,
                true,
            );
            await this.storageInterface.write(
                'chat',
                thumbnail.name,
                thumbnailFile,
            );
            await this.mediaObjectRepository.saveThumbnail(
                thumbnail,
                message.id,
            );

            return this.storageInterface.temporaryUrl(
                'chat',
                thumbnail.name,
                3600,
            );
        }
    }

    private async assetConversationExist(conversationId: string) {
        const conversation = await this.conversationRepository.findById(
            conversationId,
        );

        if (!conversation) {
            throw new NotFoundException('Conversation not found');
        }
    }

    private async assetMessageExist(messageId: string) {
        const message = await this.messageRepository.findById(messageId);

        if (!message) {
            throw new NotFoundException('Message not found');
        }
    }
}
