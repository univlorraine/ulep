import { HttpResponse } from '../../adapter/BaseHttpAdapter';
import { HttpAdapterInterface } from '../../adapter/DomainHttpAdapter';
import { CollectionCommand } from '../../command/CollectionCommand';
import MessageCommand, { messageCommandToDomain } from '../../command/MessageCommand';
import { Message } from '../entities/chat/Message';
import GetMessagesFromConversationUsecaseInterface from '../interfaces/chat/GetMessagesFromConversationUsecase.interface';

class GetMessagesFromConversationUsecase implements GetMessagesFromConversationUsecaseInterface {
    constructor(private readonly domainHttpAdapter: HttpAdapterInterface) {}

    async execute(id: string, lastMessageId?: string, limit?: number): Promise<Message[] | Error> {
        try {
            const httpResponse: HttpResponse<CollectionCommand<MessageCommand>> = await this.domainHttpAdapter.get(
                `/chat/messages/${id}?${lastMessageId ? `lastMessageId=${lastMessageId}` : ''}&${
                    limit ? `limit=${limit}` : ''
                }`
            );

            if (!httpResponse.parsedBody || httpResponse.parsedBody.items === undefined) {
                return new Error('errors.global');
            }

            return httpResponse.parsedBody.items.map((message) => messageCommandToDomain(message));
        } catch (error: any) {
            return new Error('errors.global');
        }
    }
}

export default GetMessagesFromConversationUsecase;
