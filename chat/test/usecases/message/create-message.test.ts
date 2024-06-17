import { NotFoundException } from '@nestjs/common';
import { Conversation, MessageType } from 'src/core/models';
import { Owner } from 'src/core/models/owner.model';
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
const owner1 = new Owner({
    id: USER_ID1,
    name: 'ownerName1',
    image: 'ownerImage1',
});
const owner3 = new Owner({
    id: USER_ID3,
    name: 'ownerName3',
    image: 'ownerImage3',
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
            ownerName: owner1.name,
            ownerImage: owner1.image,
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
            ownerName: owner1.name,
            ownerImage: owner1.image,
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
            ownerName: owner1.name,
            ownerImage: owner1.image,
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
            ownerName: owner1.name,
            ownerImage: owner1.image,
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
                ownerName: owner1.name,
                ownerImage: owner1.image,
                mimetype: 'application/pdf',
            }),
        ).rejects.toThrow(new NotFoundException('Conversation not found'));
    });

    it('Should throw an error if the user does not exist in the conversation', async () => {
        expect(
            createMessageUsecase.execute({
                content: 'content',
                conversationId: tandemId,
                ownerId: owner3.id,
                ownerName: owner3.name,
                ownerImage: owner3.image,
                mimetype: '',
            }),
        ).rejects.toThrow(
            new NotFoundException('User not found in conversation'),
        );
    });
});
