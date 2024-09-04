import { HttpResponse } from '../../../adapter/BaseHttpAdapter';
import { HttpAdapterInterface } from '../../../adapter/DomainHttpAdapter';
import VocabularyCommand, { vocabularyCommandToDomain } from '../../../command/VocabularyCommand';
import Vocabulary from '../../entities/Vocabulary';
import CreateVocabularyUsecaseInterface, {
    CreateVocabularyCommand,
} from '../../interfaces/vocabulary/CreateVocabularyUsecase.interface';

class CreateVocabularyUsecase implements CreateVocabularyUsecaseInterface {
    constructor(private readonly domainHttpAdapter: HttpAdapterInterface) {}

    async execute(command: CreateVocabularyCommand): Promise<Vocabulary | Error> {
        try {
            const formData = new FormData();
            formData.append('translation', command.translation);
            formData.append('vocabularyListId', command.vocabularyListId);
            formData.append('word', command.word);

            if (command.pronunciationWord) {
                formData.append('pronunciationWord', command.pronunciationWord);
            }
            if (command.pronunciationTranslation) {
                formData.append('pronunciationTranslation', command.pronunciationTranslation);
            }

            const httpResponse: HttpResponse<VocabularyCommand> = await this.domainHttpAdapter.post(
                `/vocabulary/`,
                formData,
                {},
                'multipart/form-data'
            );

            if (!httpResponse.parsedBody) {
                return new Error('errors.global');
            }

            const vocabulary = vocabularyCommandToDomain(httpResponse.parsedBody);

            return vocabulary;
        } catch (error: any) {
            return new Error('errors.global');
        }
    }
}

export default CreateVocabularyUsecase;
