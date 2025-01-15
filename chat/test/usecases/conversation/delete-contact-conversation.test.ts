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

describe('DeleteContactConversation', () => {
    const inMemoryConversationRepository = new InMemoryConversationRepository();

    const deleteContactConversationUsecase = new DeleteUserConversationUsecase(
        inMemoryConversationRepository,
    );

    beforeEach(() => {
        inMemoryConversationRepository.init([conversation1, conversation2]);
    });

    it('Should remove conversation if only one user', async () => {
        expect(inMemoryConversationRepository.conversations).toHaveLength(2);
        await deleteContactConversationUsecase.execute({
            id: USER_ID1,
            chatIdsToIgnore: [],
            chatIdsToLeave: [],
        });
        expect(inMemoryConversationRepository.conversations).toHaveLength(1);
    });

    it('Should remove contact from conversation', async () => {
        expect(inMemoryConversationRepository.conversations).toHaveLength(2);
        await deleteContactConversationUsecase.execute({
            id: USER_ID4,
            chatIdsToIgnore: [],
            chatIdsToLeave: [],
        });
        const updatedConversation =
            inMemoryConversationRepository.conversations.find(
                (conversation) => conversation.id === tandemId2,
            );
        expect(updatedConversation?.usersIds).toHaveLength(2);
    });
});
