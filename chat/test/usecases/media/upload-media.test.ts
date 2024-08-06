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
