import { HttpResponse } from '../../adapter/BaseHttpAdapter';
import { HttpAdapterInterface } from '../../adapter/DomainHttpAdapter';
import { CollectionCommand } from '../../command/CollectionCommand';
import ConversationCommand, { conversationCommandToDomain } from '../../command/ConversationCommand';
import Conversation from '../entities/chat/Conversation';
import GetConversationsUsecaseInterface from '../interfaces/chat/GetConversationsUsecase.interface';

class GetConversationsUsecase implements GetConversationsUsecaseInterface {
    constructor(private readonly domainHttpAdapter: HttpAdapterInterface) {}

    async execute(id: string): Promise<Conversation[] | Error> {
        try {
            const httpResponse: HttpResponse<CollectionCommand<ConversationCommand>> = await this.domainHttpAdapter.get(
                `/chat/${id}`
            );

            if (!httpResponse.parsedBody || !httpResponse.parsedBody.items) {
                return new Error('errors.global');
            }

            return httpResponse.parsedBody.items.map((conversation) => conversationCommandToDomain(conversation));
        } catch (error: any) {
            return new Error('errors.global');
        }
    }
}

export default GetConversationsUsecase;
