import { HttpResponse } from '../../adapter/BaseHttpAdapter';
import { HttpAdapterInterface } from '../../adapter/DomainHttpAdapter';
import { CollectionCommand } from '../../command/CollectionCommand';
import { MessageCommand, messageCommandToDomain } from '../../command/MessageCommand';
import { MessagePaginationDirection } from '../entities/chat/Conversation';
import { Message } from '../entities/chat/Message';
import GetMessagesFromConversationUsecaseInterface, {
    GetMessagesFromConversationUsecaseParams,
} from '../interfaces/chat/GetMessagesFromConversationUsecase.interface';

class GetMessagesFromConversationUsecase implements GetMessagesFromConversationUsecaseInterface {
    constructor(private readonly domainHttpAdapter: HttpAdapterInterface) {}

    async execute(id: string, params: GetMessagesFromConversationUsecaseParams): Promise<Message[] | Error> {
        try {
            const direction = params.direction ?? MessagePaginationDirection.FORWARD;
            const httpResponse: HttpResponse<CollectionCommand<MessageCommand>> = await this.domainHttpAdapter.get(
                `/chat/messages/${id}?${params.lastMessageId ? `lastMessageId=${params.lastMessageId}` : ''}&${
                    params.limit ? `limit=${params.limit}` : ''
                }&${params.typeFilter ? `typeFilter=${params.typeFilter}` : ''}&${
                    params.direction ? `direction=${direction}&` : ''
                }${params.parentId ? `parentId=${params.parentId}` : ''}`
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
