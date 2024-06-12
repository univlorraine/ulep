import { CreateMultipleConversationsUsecase } from 'src/core/usecases';
import { InMemoryConversationRepository } from 'src/providers/persistance/repositories/in-memory-conversation.repository';

const USER_ID1 = 'user1';
const USER_ID2 = 'user2';
const USER_ID3 = 'user3';
const USER_ID4 = 'user4';

describe('CreateMultipleConversations', () => {
    const inMemoryConversationRepository = new InMemoryConversationRepository();

    const createMultipleConversationsUsecase =
        new CreateMultipleConversationsUsecase(inMemoryConversationRepository);

    beforeEach(() => {
        inMemoryConversationRepository.reset();
    });

    it('Should create a new conversations', async () => {
        await createMultipleConversationsUsecase.execute({
            participants: [
                [USER_ID1, USER_ID2],
                [USER_ID3, USER_ID4],
            ],
        });

        expect(inMemoryConversationRepository.conversations).toHaveLength(2);
    });
});
