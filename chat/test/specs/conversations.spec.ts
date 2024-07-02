import { Test } from '@nestjs/testing';
import { AuthenticationGuard } from 'src/api/guards';
import { AppModule } from 'src/app.module';
import { Conversation, Message, MessageType } from 'src/core/models';
import { MediaObject } from 'src/core/models/media.model';
import { CONVERSATION_REPOSITORY } from 'src/core/ports/conversation.repository';
import { HUB_GATEWAY } from 'src/core/ports/hub.gateway';
import { MEDIA_OBJECT_REPOSITORY } from 'src/core/ports/media-object.repository';
import { MESSAGE_REPOSITORY } from 'src/core/ports/message.repository';
import { NOTIFICATION_SERVICE } from 'src/core/ports/notification.service';
import { InMemoryConversationRepository } from 'src/providers/persistance/repositories/in-memory-conversation.repository';
import { InMemoryMediaObjectRepository } from 'src/providers/persistance/repositories/in-memory-media-object.repository';
import { InMemoryMessageRepository } from 'src/providers/persistance/repositories/in-memory-message.repository';
import * as request from 'supertest';
import { HubGateway } from '../mocks/hub.gateway';
import { NotificationService } from '../mocks/notification.service';
import { TestAuthGuard } from '../utils/TestAuthGuard';
import { TestServer } from './test.server';

describe('Conversations', () => {
    let app: TestServer;

    const inMemoryConversationRepository = new InMemoryConversationRepository();
    const inMemoryMediaObjectRepository = new InMemoryMediaObjectRepository();
    const inMemoryMessageRepository = new InMemoryMessageRepository();

    const CONVERSATION1_ID = 'conversation-123';
    const CONVERSATION2_ID = 'conversation-456';
    const OWNER1_ID = 'owner-123';
    const OWNER2_ID = 'owner-456';
    const OWNER3_ID = 'owner-789';
    const conversation1 = new Conversation({
        id: CONVERSATION1_ID,
        createdAt: new Date(),
        usersIds: [OWNER1_ID, OWNER3_ID],
        lastActivity: new Date(),
        metadata: {},
    });

    const conversation2 = new Conversation({
        id: CONVERSATION2_ID,
        createdAt: new Date(),
        usersIds: [],
        lastActivity: new Date(),
        metadata: {},
    });

    const message1 = new Message({
        id: 'message-123',
        conversationId: CONVERSATION1_ID,
        content: 'Hello World',
        ownerId: OWNER1_ID,
        isReported: false,
        isDeleted: false,
        type: MessageType.Text,
    });

    const message2 = new Message({
        id: 'message-456',
        conversationId: CONVERSATION1_ID,
        content: 'Hello World',
        ownerId: OWNER2_ID,
        isReported: false,
        isDeleted: false,
        type: MessageType.Text,
    });

    const MEDIA_OBJECT1_ID = 'imageId';
    const mediaObject1 = new MediaObject({
        id: MEDIA_OBJECT1_ID,
        bucket: 'bucket',
        name: 'image.jpg',
        mimetype: 'image/jpeg',
        size: 123,
    });

    const messageImage = new Message({
        id: 'message-image',
        conversationId: CONVERSATION1_ID,
        content: MEDIA_OBJECT1_ID,
        ownerId: OWNER2_ID,
        isReported: false,
        isDeleted: false,
        type: MessageType.Text,
    });

    beforeAll(async () => {
        const module = await Test.createTestingModule({
            imports: [AppModule],
        })
            .overrideGuard(AuthenticationGuard)
            .useValue(TestAuthGuard)
            .overrideProvider(CONVERSATION_REPOSITORY)
            .useValue(inMemoryConversationRepository)
            .overrideProvider(MEDIA_OBJECT_REPOSITORY)
            .useValue(inMemoryMediaObjectRepository)
            .overrideProvider(MESSAGE_REPOSITORY)
            .useValue(inMemoryMessageRepository)
            .overrideProvider(NOTIFICATION_SERVICE)
            .useValue(new NotificationService())
            .overrideProvider(HUB_GATEWAY)
            .useValue(new HubGateway())
            .compile();

        app = TestServer.create(module.createNestApplication());
        await app.run();
    });

    beforeEach(() => {
        inMemoryConversationRepository.init([conversation1, conversation2]);
        inMemoryMediaObjectRepository.init([mediaObject1]);
        inMemoryMessageRepository.init([message1, message2, messageImage]);
    });

    afterAll(async () => {
        await app.teardown();
    });

    test('Get all conversations for a user', async () => {
        const { body } = await request(app.getHttpServer())
            .get(`/conversations/${OWNER1_ID}`)
            .expect(200);

        expect(body.items).toBeInstanceOf(Array);
        expect(body.totalItems).toBe(1);
    });

    test('Get all conversations for a user that does not exist', async () => {
        const { body } = await request(app.getHttpServer())
            .get(`/conversations/owner-000`)
            .expect(200);

        expect(body.items).toBeInstanceOf(Array);
        expect(body.totalItems).toBe(0);
    });

    test('Create a conversation', async () => {
        const conversationData = {
            tandemId: 'conversation-789',
            userIds: [OWNER1_ID, OWNER2_ID],
            metadata: { topic: 'Discussion' },
        };

        const { body } = await request(app.getHttpServer())
            .post('/conversations')
            .send(conversationData)
            .expect(201);

        expect(body.id).toBeDefined();
        expect(body.usersIds).toEqual(
            expect.arrayContaining([OWNER1_ID, OWNER2_ID]),
        );
        expect(body.id).toEqual('conversation-789');
    });

    test('Create multiple conversations', async () => {
        const conversations = [
            { participants: [OWNER1_ID, OWNER2_ID] },
            {
                participants: [OWNER1_ID, OWNER3_ID],
                tandemId: 'conversation-789',
            },
        ];

        await request(app.getHttpServer())
            .post('/conversations/multi')
            .send({ conversations })
            .expect(201);
    });

    test('Delete a conversation', async () => {
        await request(app.getHttpServer())
            .delete(`/conversations/${conversation1.id}`)
            .expect(200);
    });

    test('Delete user from conversations', async () => {
        await request(app.getHttpServer())
            .delete(`/conversations/user/${OWNER1_ID}`)
            .expect(200);
    });

    test('Delete contact from conversations', async () => {
        await request(app.getHttpServer())
            .delete(`/conversations/contact/${OWNER1_ID}`)
            .expect(200);
    });

    test('Send a message in a conversation', async () => {
        const messageData = {
            content: 'Hello World',
            senderId: OWNER1_ID,
        };

        const { body } = await request(app.getHttpServer())
            .post(`/conversations/${CONVERSATION1_ID}/message`)
            .send(messageData)
            .expect(201);

        expect(body.content).toEqual('Hello World');
        expect(body.type).toEqual('text');
        expect(body.ownerId).toEqual(OWNER1_ID);
    });

    test('Send a message in a conversation where the user doesnt exist', async () => {
        const messageData = {
            content: 'Hello World',
            senderId: OWNER1_ID,
        };

        await request(app.getHttpServer())
            .post(`/conversations/${CONVERSATION2_ID}/message`)
            .send(messageData)
            .expect(404);
    });
});
