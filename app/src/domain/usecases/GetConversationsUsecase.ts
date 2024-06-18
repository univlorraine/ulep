import { HttpResponse } from '../../adapter/BaseHttpAdapter';
import { HttpAdapterInterface } from '../../adapter/DomainHttpAdapter';
import ConversationCommand, { conversationCommandToDomain } from '../../command/ConversationCommand';
import Conversation from '../entities/chat/Conversation';
import GetConversationsUsecaseInterface from '../interfaces/chat/GetConversationsUsecase.interface';

class GetConversationsUsecase implements GetConversationsUsecaseInterface {
    constructor(private readonly domainHttpAdapter: HttpAdapterInterface) {}

    async execute(id: string): Promise<Conversation[] | Error> {
        try {
            const httpResponse: HttpResponse<ConversationCommand[]> = await this.domainHttpAdapter.get(
                `/conversations/${id}`
            );

            if (!httpResponse.parsedBody) {
                return new Error('errors.global');
            }

            return httpResponse.parsedBody.map((conversation) => conversationCommandToDomain(conversation));
        } catch (error: any) {
            return new Error('errors.global');
        }
    }
}

export default GetConversationsUsecase;
