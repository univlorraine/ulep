import { HttpResponse } from '../../../adapter/BaseHttpAdapter';
import { HttpAdapterInterface } from '../../../adapter/DomainHttpAdapter';
import VocabularyListCommand, { vocabularyListCommandToDomain } from '../../../command/VocabularyListCommand';
import VocabularyList from '../../entities/VocabularyList';
import UpdateVocabularyListUsecaseInterface, {
    UpdateVocabularyListCommand,
} from '../../interfaces/vocabulary/UpdateVocabularyListUsecase.interface';

class UpdateVocabularyListUsecase implements UpdateVocabularyListUsecaseInterface {
    constructor(private readonly domainHttpAdapter: HttpAdapterInterface) {}

    async execute(id: string, command: UpdateVocabularyListCommand): Promise<VocabularyList | Error> {
        try {
            const httpResponse: HttpResponse<VocabularyListCommand> = await this.domainHttpAdapter.put(
                `/vocabulary/list/${id}/`,
                {
                    name: command.name,
                    symbol: command.symbol,
                    profileIds: command.profileIds,
                }
            );

            if (!httpResponse.parsedBody) {
                return new Error('errors.global');
            }

            const vocabularyList = vocabularyListCommandToDomain(httpResponse.parsedBody);

            return vocabularyList;
        } catch (error: any) {
            return new Error('errors.global');
        }
    }
}

export default UpdateVocabularyListUsecase;
