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
import { Conversation, Message, MessageType } from 'src/core/models';
import { UploadMediaUsecase } from 'src/core/usecases';
import { InMemoryConversationRepository } from 'src/providers/persistance/repositories/in-memory-conversation.repository';
import { InMemoryMediaObjectRepository } from 'src/providers/persistance/repositories/in-memory-media-object.repository';
import { InMemoryMessageRepository } from 'src/providers/persistance/repositories/in-memory-message.repository';
import { MinioStorage } from '../../mocks/minio.storage';

const mockFile: Express.Multer.File = {
    fieldname: 'file',
    originalname: 'testfile.png',
    encoding: '7bit',
    mimetype: 'image/png',
    destination: 'uploads/',
    filename: 'testfile.png',
    path: 'uploads/testfile.png',
    size: 1024,
    buffer: Buffer.from('This is a test file content', 'utf-8'),
    stream: null as any,
};

const USER_ID1 = 'user1';
const USER_ID2 = 'user2';
const tandemId = 'tandemId';
const conversation = new Conversation({
    id: tandemId,
    createdAt: new Date(),
    usersIds: [USER_ID1, USER_ID2],
    lastActivity: new Date(),
    metadata: {},
});

const message = new Message({
    id: 'messageId',
    conversationId: tandemId,
    createdAt: new Date(),
    ownerId: USER_ID1,
    type: MessageType.Image,
    content: '',
    isReported: false,
    isDeleted: false,
});

const wrongMessage = new Message({
    id: 'wrongId',
    conversationId: tandemId,
    createdAt: new Date(),
    ownerId: USER_ID1,
    type: MessageType.Image,
    content: '',
    isReported: false,
    isDeleted: false,
});

jest.mock('../../mocks/minio.storage', () => {
    return {
        MinioStorage: jest.fn().mockImplementation(() => {
            return {
                write: jest.fn().mockResolvedValue('some value'),
                temporaryUrl: jest.fn().mockResolvedValue('some value'),
            };
        }),
    };
});

describe('UploadMedia', () => {
    const inMemoryMediaRepository = new InMemoryMediaObjectRepository();
    const inMemoryConversationRepository = new InMemoryConversationRepository();
    const inMemoryMessageRepository = new InMemoryMessageRepository();
    const mockedStorage = new MinioStorage();

    const uploadMediaUsecase = new UploadMediaUsecase(
        inMemoryMessageRepository,
        inMemoryConversationRepository,
        mockedStorage,
        inMemoryMediaRepository,
    );

    beforeEach(() => {
        inMemoryConversationRepository.init([conversation]);
        inMemoryMessageRepository.init([message]);
    });

    it('Should create a new media', async () => {
        const media = await uploadMediaUsecase.execute({
            conversationId: tandemId,
            message: message,
            file: mockFile,
            filename: 'testfile.png',
        });

        expect(mockedStorage.write).toHaveBeenCalled();
        expect(inMemoryMediaRepository.mediaObjects).toHaveLength(1);
        expect(media).toBe('some value');
    });

    it('Should throw an error if the message does not exist', async () => {
        expect(
            uploadMediaUsecase.execute({
                conversationId: tandemId,
                message: wrongMessage,
                file: mockFile,
                filename: 'testfile.png',
            }),
        ).rejects.toThrow(new NotFoundException('Message not found'));
    });

    it('Should throw an error if the conversation does not exist', async () => {
        expect(
            uploadMediaUsecase.execute({
                conversationId: 'wrongId',
                message: message,
                file: mockFile,
                filename: 'testfile.png',
            }),
        ).rejects.toThrow(new NotFoundException('Conversation not found'));
    });
});
