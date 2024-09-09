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
            const formData: CreateVocabularyCommand = {
                translation: command.translation,
                vocabularyListId: command.vocabularyListId,
                word: command.word,
            };

            if (command.wordPronunciation) {
                formData.wordPronunciation = command.wordPronunciation;
            }
            if (command.translationPronunciation) {
                formData.translationPronunciation = command.translationPronunciation;
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
