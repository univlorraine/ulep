import { HttpResponse } from '../../../adapter/BaseHttpAdapter';
import { HttpAdapterInterface } from '../../../adapter/DomainHttpAdapter';
import { CollectionCommand } from '../../../command/CollectionCommand';
import HashtagCommand, { hashtagCommandToDomain } from '../../../command/HashtagCommand';
import Hashtag from '../../entities/chat/Hashtag';
import GetHashtagsFromConversationUsecaseInterface from '../../interfaces/chat/GetHastagsFromConversationUsecase.interface';

class GetHashtagsFromConversationUsecase implements GetHashtagsFromConversationUsecaseInterface {
    constructor(private readonly chatHttpAdapter: HttpAdapterInterface) {}

    async execute(id: string): Promise<Hashtag[] | Error> {
        try {
            const httpResponse: HttpResponse<CollectionCommand<HashtagCommand>> = await this.chatHttpAdapter.get(
                `/chat/${id}/hashtags`
            );

            if (!httpResponse.parsedBody || !httpResponse.parsedBody.items) {
                return new Error('errors.global');
            }

            return httpResponse.parsedBody.items.map((hashtag) => hashtagCommandToDomain(hashtag));
        } catch (error: any) {
            console.error({ error });
            return new Error('errors.global');
        }
    }
}

export default GetHashtagsFromConversationUsecase;
