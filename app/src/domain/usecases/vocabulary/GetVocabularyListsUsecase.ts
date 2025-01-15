import { HttpResponse } from '../../../adapter/BaseHttpAdapter';
import { HttpAdapterInterface } from '../../../adapter/DomainHttpAdapter';
import { CollectionCommand } from '../../../command/CollectionCommand';
import VocabularyListCommand, { vocabularyListCommandToDomain } from '../../../command/VocabularyListCommand';
import VocabularyList from '../../entities/VocabularyList';
import GetVocabularyListsUsecaseInterface from '../../interfaces/vocabulary/GetVocabularyListsUsecase.interface';

class GetVocabularyListsUsecase implements GetVocabularyListsUsecaseInterface {
    constructor(private readonly domainHttpAdapter: HttpAdapterInterface) {}

    async execute(profileId: string, languageCode: string): Promise<VocabularyList[] | Error> {
        try {
            const httpResponse: HttpResponse<CollectionCommand<VocabularyListCommand>> =
                await this.domainHttpAdapter.get(`/vocabulary/list/${profileId}?languageCode=${languageCode}`);

            if (!httpResponse.parsedBody) {
                return new Error('errors.global');
            }

            return httpResponse.parsedBody.items.map(vocabularyListCommandToDomain);
        } catch (error: any) {
            return new Error('errors.global');
        }
    }
}

export default GetVocabularyListsUsecase;
