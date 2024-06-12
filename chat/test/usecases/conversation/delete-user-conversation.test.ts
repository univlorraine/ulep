import { Conversation } from 'src/core/models';
import { DeleteUserConversationUsecase } from 'src/core/usecases';
import { InMemoryConversationRepository } from 'src/providers/persistance/repositories/in-memory-conversation.repository';

const USER_ID1 = 'user1';
const USER_ID2 = 'user2';
const USER_ID3 = 'user3';
const USER_ID4 = 'user4';
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
    usersIds: [USER_ID4, USER_ID2, USER_ID3],
    metadata: {},
    createdAt: new Date(),
    lastActivity: new Date(),
});

describe('DeleteUserConversation', () => {
    const inMemoryConversationRepository = new InMemoryConversationRepository();

    const deleteUserConversationUsecase = new DeleteUserConversationUsecase(
        inMemoryConversationRepository,
    );

    beforeEach(() => {
        inMemoryConversationRepository.init([conversation1, conversation2]);
    });

    it('Should remove conversations', async () => {
        expect(inMemoryConversationRepository.conversations).toHaveLength(2);
        await deleteUserConversationUsecase.execute({
            id: USER_ID2,
        });
        expect(inMemoryConversationRepository.conversations).toHaveLength(0);
    });
});
