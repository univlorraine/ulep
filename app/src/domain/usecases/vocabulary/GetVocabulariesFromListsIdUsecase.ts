import { HttpResponse } from '../../../adapter/BaseHttpAdapter';
import { HttpAdapterInterface } from '../../../adapter/DomainHttpAdapter';
import { CollectionCommand } from '../../../command/CollectionCommand';
import VocabularyCommand, { vocabularyCommandToDomain } from '../../../command/VocabularyCommand';
import Vocabulary from '../../entities/Vocabulary';
import GetVocabulariesFromListsIdUsecaseInterface from '../../interfaces/vocabulary/GetVocabulariesFromListsIdUsecase.interface';

class GetVocabulariesFromListsIdUsecase implements GetVocabulariesFromListsIdUsecaseInterface {
    constructor(private readonly domainHttpAdapter: HttpAdapterInterface) {}

    async execute(vocabularyListsId: string[]): Promise<Vocabulary[] | Error> {
        const vocabularyListsIdQuery = vocabularyListsId.map((id) => `vocabularySelectedListsId=${id}`).join('&');

        try {
            const httpResponse: HttpResponse<CollectionCommand<VocabularyCommand>> = await this.domainHttpAdapter.get(
                `/vocabulary/random${`?${vocabularyListsIdQuery}`}`
            );

            if (!httpResponse.parsedBody) {
                return new Error('errors.global');
            }

            return httpResponse.parsedBody.items.map(vocabularyCommandToDomain);
        } catch (error: any) {
            return new Error('errors.global');
        }
    }
}

export default GetVocabulariesFromListsIdUsecase;
