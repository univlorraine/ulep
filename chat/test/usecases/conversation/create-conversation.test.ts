import { RessourceAlreadyExists } from 'src/core/errors';
import { CreateConversationUsecase } from 'src/core/usecases';
import { InMemoryConversationRepository } from 'src/providers/persistance/repositories/in-memory-conversation.repository';

const USER_ID1 = 'user1';
const USER_ID2 = 'user2';
const tandemId = 'tandemId';

describe('CreateConversation', () => {
    const inMemoryConversationRepository = new InMemoryConversationRepository();

    const createConversationUsecase = new CreateConversationUsecase(
        inMemoryConversationRepository,
    );

    beforeEach(() => {
        inMemoryConversationRepository.reset();
    });

    it('Should create a new conversation', async () => {
        const conversation = await createConversationUsecase.execute({
            tandemId,
            userIds: [USER_ID1, USER_ID2],
            metadata: {},
        });

        expect(conversation).toBeDefined();
        expect(conversation.id).toBe(tandemId);
        expect(conversation.usersIds).toEqual([USER_ID1, USER_ID2]);
        expect(conversation.metadata).toEqual({});
    });

    it('Should throw an error if the conversation already exists', async () => {
        await createConversationUsecase.execute({
            tandemId,
            userIds: [USER_ID1, USER_ID2],
            metadata: {},
        });

        expect(
            createConversationUsecase.execute({
                tandemId,
                userIds: [USER_ID1, USER_ID2],
                metadata: {},
            }),
        ).rejects.toBeInstanceOf(RessourceAlreadyExists);
    });
});
