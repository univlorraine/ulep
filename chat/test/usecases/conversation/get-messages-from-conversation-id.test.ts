import { Conversation, Message, MessageType } from 'src/core/models';
import { Owner } from 'src/core/models/owner.model';
import { GetMessagesFromConversationIdUsecase } from 'src/core/usecases';
import { InMemoryConversationRepository } from 'src/providers/persistance/repositories/in-memory-conversation.repository';
import { InMemoryMessageRepository } from 'src/providers/persistance/repositories/in-memory-message.repository';

const USER_ID1 = 'user1';
const USER_ID2 = 'user2';
const owner1 = new Owner({ id: USER_ID1, name: 'name1', image: 'image1' });
const owner2 = new Owner({ id: USER_ID2, name: 'name2', image: 'image2' });
const tandemId1 = 'tandemId1';
const tandemId2 = 'tandemId2';
const conversation1 = new Conversation({
    id: tandemId1,
    usersIds: [USER_ID1, USER_ID2],
    metadata: {},
    createdAt: new Date(),
    lastActivity: new Date(),
});

const conversation2 = new Conversation({
    id: tandemId2,
    usersIds: [USER_ID1],
    metadata: {},
    createdAt: new Date(),
    lastActivity: new Date(),
});

const message1 = new Message({
    id: 'message1',
    conversationId: tandemId1,
    owner: owner1,
    content: 'Hello',
    createdAt: new Date(),
    isReported: false,
    type: MessageType.Text,
});

const message2 = new Message({
    id: 'message2',
    conversationId: tandemId1,
    owner: owner2,
    content: 'Hello you',
    createdAt: new Date(),
    isReported: false,
    type: MessageType.Text,
});

const message3 = new Message({
    id: 'message3',
    conversationId: tandemId2,
    owner: owner2,
    content: 'Hello',
    createdAt: new Date(),
    isReported: false,
    type: MessageType.Text,
});

describe('GetConversationFromUserIdUsecase', () => {
    const inMemoryMessageRepository = new InMemoryMessageRepository();
    const inMemoryConversationRepository = new InMemoryConversationRepository();

    const getMessagesFromConversationIdUsecase =
        new GetMessagesFromConversationIdUsecase(
            inMemoryConversationRepository,
            inMemoryMessageRepository,
        );

    beforeEach(() => {
        inMemoryConversationRepository.init([conversation1, conversation2]);
        inMemoryMessageRepository.init([message1, message2, message3]);
    });

    it('Should get messages from conversation id', async () => {
        const messages1 = await getMessagesFromConversationIdUsecase.execute({
            id: tandemId1,
            pagination: undefined,
            filter: undefined,
        });
        expect(messages1).toHaveLength(2);

        const messages2 = await getMessagesFromConversationIdUsecase.execute({
            id: tandemId2,
            pagination: undefined,
            filter: undefined,
        });
        expect(messages2).toHaveLength(1);
    });
});
