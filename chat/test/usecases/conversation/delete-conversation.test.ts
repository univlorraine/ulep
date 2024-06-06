import { RessourceAlreadyExists } from 'src/core/errors';
import { Conversation } from 'src/core/models';
import { DeleteConversationUsecase } from 'src/core/usecases';
import { InMemoryConversationRepository } from 'src/providers/persistance/repositories/in-memory-conversation.repository';

const USER_ID1 = 'user1';
const USER_ID2 = 'user2';
const tandemId = 'tandemId';
const conversation = new Conversation({
    id: tandemId,
    usersIds: [USER_ID1, USER_ID2],
    metadata: {},
    createdAt: new Date(),
    lastActivity: new Date(),
});

describe('DeleteConversation', () => {
    const inMemoryConversationRepository = new InMemoryConversationRepository();

    const deleteConversationUsecase = new DeleteConversationUsecase(
        inMemoryConversationRepository,
    );

    beforeEach(() => {
        inMemoryConversationRepository.init([conversation]);
    });

    it('Should delete conversation', async () => {
        expect(inMemoryConversationRepository.conversations).toHaveLength(1);
        await deleteConversationUsecase.execute({
            id: tandemId,
        });
        expect(inMemoryConversationRepository.conversations).toHaveLength(0);
    });

    it('Should do nothing if the conversation does not exist', async () => {
        expect(inMemoryConversationRepository.conversations).toHaveLength(1);
        await deleteConversationUsecase.execute({
            id: 'wrongId',
        });
        expect(inMemoryConversationRepository.conversations).toHaveLength(1);
    });
});
