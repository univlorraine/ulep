import { Conversation } from 'src/core/models';
import { GetConversationFromUserIdUsecase } from 'src/core/usecases';
import { InMemoryConversationRepository } from 'src/providers/persistance/repositories/in-memory-conversation.repository';

const USER_ID1 = 'user1';
const USER_ID2 = 'user2';
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

describe('GetConversationFromUserIdUsecase', () => {
    const inMemoryConversationRepository = new InMemoryConversationRepository();

    const getConversationFromUserIdUsecase =
        new GetConversationFromUserIdUsecase(inMemoryConversationRepository);

    beforeEach(() => {
        inMemoryConversationRepository.init([conversation1, conversation2]);
    });

    it('Should get conversations from user id', async () => {
        const conversations1 = await getConversationFromUserIdUsecase.execute({
            id: USER_ID1,
        });
        expect(conversations1).toHaveLength(2);

        const conversations2 = await getConversationFromUserIdUsecase.execute({
            id: USER_ID2,
        });
        expect(conversations2).toHaveLength(1);

        const conversations3 = await getConversationFromUserIdUsecase.execute({
            id: 'WRONG_ID',
        });
        expect(conversations3).toHaveLength(0);
    });
});
