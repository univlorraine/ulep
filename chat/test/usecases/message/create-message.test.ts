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

import { NotFoundException } from '@nestjs/common';
import { Conversation, MessageType } from 'src/core/models';
import { CreateMessageUsecase } from 'src/core/usecases';
import { InMemoryConversationRepository } from 'src/providers/persistance/repositories/in-memory-conversation.repository';
import { InMemoryMessageRepository } from 'src/providers/persistance/repositories/in-memory-message.repository';
import { UuidProvider } from 'src/providers/services/uuid.provider';
import { NotificationService } from '../../mocks/notification.service';

const USER_ID1 = 'user1';
const USER_ID2 = 'user2';
const USER_ID3 = 'user3';
const tandemId = 'tandemId';
const conversation = new Conversation({
    id: tandemId,
    createdAt: new Date(),
    usersIds: [USER_ID1, USER_ID2],
    lastActivity: new Date(),
    metadata: {},
});

jest.mock('../../mocks/notification.service', () => {
    return {
        NotificationService: jest.fn().mockImplementation(() => {
            return {
                sendNotification: jest.fn(),
            };
        }),
    };
});

describe('CreateMessage', () => {
    const inMemoryConversationRepository = new InMemoryConversationRepository();
    const inMemoryMessageRepository = new InMemoryMessageRepository();
    const uuidProvider = new UuidProvider();
    const notificationService = new NotificationService();

    const createMessageUsecase = new CreateMessageUsecase(
        inMemoryConversationRepository,
        inMemoryMessageRepository,
        uuidProvider,
        notificationService,
    );

    beforeEach(() => {
        inMemoryConversationRepository.init([conversation]);
    });

    it('Should create a new text message', async () => {
        const message = await createMessageUsecase.execute({
            content: 'content',
            conversationId: tandemId,
            ownerId: USER_ID1,
            mimetype: '',
        });
        expect(notificationService.sendNotification).toHaveBeenCalled();
        expect(message).toBeDefined();
        expect(message.type).toBe(MessageType.Text);
    });

    it('Should create a new image message', async () => {
        const message = await createMessageUsecase.execute({
            content: '',
            conversationId: tandemId,
            ownerId: USER_ID1,
            mimetype: 'image/png',
        });
        expect(notificationService.sendNotification).toHaveBeenCalled();
        expect(message).toBeDefined();
        expect(message.type).toBe(MessageType.Image);
    });

    it('Should create a new audio message', async () => {
        const message = await createMessageUsecase.execute({
            content: '',
            conversationId: tandemId,
            ownerId: USER_ID1,
            mimetype: 'audio/mpeg',
        });
        expect(notificationService.sendNotification).toHaveBeenCalled();
        expect(message).toBeDefined();
        expect(message.type).toBe(MessageType.Audio);
    });

    it('Should create a new file message', async () => {
        const message = await createMessageUsecase.execute({
            content: '',
            conversationId: tandemId,
            ownerId: USER_ID1,
            mimetype: 'application/pdf',
        });
        expect(notificationService.sendNotification).toHaveBeenCalled();
        expect(message).toBeDefined();
        expect(message.type).toBe(MessageType.File);
    });

    it('Should throw an error if the conversation does not exist', async () => {
        expect(
            createMessageUsecase.execute({
                content: '',
                conversationId: 'wrongId',
                ownerId: USER_ID1,
                mimetype: 'application/pdf',
            }),
        ).rejects.toThrow(new NotFoundException('Conversation not found'));
    });

    it('Should throw an error if the user does not exist in the conversation', async () => {
        expect(
            createMessageUsecase.execute({
                content: 'content',
                conversationId: tandemId,
                ownerId: USER_ID3,
                mimetype: '',
            }),
        ).rejects.toThrow(
            new NotFoundException('User not found in conversation'),
        );
    });
});
