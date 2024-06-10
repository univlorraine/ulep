import { NotFoundException } from '@nestjs/common';
import { Message, MessageType } from 'src/core/models';
import { Owner } from 'src/core/models/owner.model';
import { UpdateMessageUsecase } from 'src/core/usecases';
import { InMemoryMessageRepository } from 'src/providers/persistance/repositories/in-memory-message.repository';

const USER_ID1 = 'user1';
const tandemId = 'tandemId';
const owner1 = new Owner({
    id: USER_ID1,
    name: 'ownerName1',
    image: 'ownerImage1',
});

const message = new Message({
    id: 'messageId',
    conversationId: tandemId,
    owner: owner1,
    type: MessageType.Text,
    content: 'content',
    createdAt: new Date(),
    isReported: false,
});

describe('UpdateMessage', () => {
    const inMemoryMessageRepository = new InMemoryMessageRepository();

    const updateMessageUsecase = new UpdateMessageUsecase(
        inMemoryMessageRepository,
    );

    beforeEach(() => {
        inMemoryMessageRepository.init([message]);
    });

    it('Should update a new text message', async () => {
        const updatedMessage = await updateMessageUsecase.execute({
            messageId: message.id,
            isReported: true,
            content: 'new content',
        });
        expect(updatedMessage).toBeDefined();
        expect(updatedMessage.isReported).toBe(true);
        expect(updatedMessage.content).toBe('new content');
    });

    it('Should throw an error if the message does not exist', async () => {
        expect(
            updateMessageUsecase.execute({
                messageId: 'wrongId',
                isReported: true,
                content: 'new content',
            }),
        ).rejects.toThrow(new NotFoundException('Message not found'));
    });
});
