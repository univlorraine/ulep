import { HttpResponse } from '../../../adapter/BaseHttpAdapter';
import { HttpAdapterInterface } from '../../../adapter/DomainHttpAdapter';
import SearchMessagesIdsFromConversationUsecaseInterface from '../../interfaces/chat/SearchMessagesIdsFromConversationUsecase.interface';

class SearchMessagesIdsFromConversationUsecase implements SearchMessagesIdsFromConversationUsecaseInterface {
    constructor(private readonly domainHttpAdapter: HttpAdapterInterface) {}

    async execute(id: string, searchText: string): Promise<string[] | Error> {
        try {
            const httpResponse: HttpResponse<string[]> = await this.domainHttpAdapter.get(
                `/conversations/messages/${id}/${searchText}`
            );

            if (!httpResponse.parsedBody) {
                return new Error('errors.global');
            }

            return httpResponse.parsedBody;
        } catch (error: any) {
            return new Error('errors.global');
        }
    }
}

export default SearchMessagesIdsFromConversationUsecase;
