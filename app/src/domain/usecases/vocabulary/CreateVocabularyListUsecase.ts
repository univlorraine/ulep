import { HttpResponse } from '../../../adapter/BaseHttpAdapter';
import { HttpAdapterInterface } from '../../../adapter/DomainHttpAdapter';
import VocabularyListCommand, { vocabularyListCommandToDomain } from '../../../command/VocabularyListCommand';
import VocabularyList from '../../entities/VocabularyList';
import CreateVocabularyListUsecaseInterface, {
    CreateVocabularyListCommand,
} from '../../interfaces/vocabulary/CreateVocabularyListUsecase.interface';

class CreateVocabularyListUsecase implements CreateVocabularyListUsecaseInterface {
    constructor(private readonly domainHttpAdapter: HttpAdapterInterface) {}

    async execute(command: CreateVocabularyListCommand): Promise<VocabularyList | Error> {
        try {
            const httpResponse: HttpResponse<VocabularyListCommand> = await this.domainHttpAdapter.post(
                `/vocabulary/list/`,
                {
                    name: command.name,
                    symbol: command.symbol,
                    profileIds: command.profileId,
                    wordLanguageCode: command.wordLanguageCode,
                    translationLanguageCode: command.translationLanguageCode,
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

export default CreateVocabularyListUsecase;
