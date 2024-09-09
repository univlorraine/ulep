import { HttpResponse } from '../../../adapter/BaseHttpAdapter';
import { HttpAdapterInterface } from '../../../adapter/DomainHttpAdapter';
import { CollectionCommand } from '../../../command/CollectionCommand';
import VocabularyCommand, { vocabularyCommandToDomain } from '../../../command/VocabularyCommand';
import Vocabulary from '../../entities/Vocabulary';
import GetVocabulariesUsecaseInterface from '../../interfaces/vocabulary/GetVocabulariesUsecase.interface';

class GetVocabulariesUsecase implements GetVocabulariesUsecaseInterface {
    constructor(private readonly domainHttpAdapter: HttpAdapterInterface) {}

    async execute(vocabularyListId: string, search?: string): Promise<Vocabulary[] | Error> {
        try {
            const httpResponse: HttpResponse<CollectionCommand<VocabularyCommand>> = await this.domainHttpAdapter.get(
                `/vocabulary/${vocabularyListId}${search ? `?search=${search}` : ''}`
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

export default GetVocabulariesUsecase;
