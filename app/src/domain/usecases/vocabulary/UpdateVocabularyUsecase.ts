import { HttpResponse } from '../../../adapter/BaseHttpAdapter';
import { HttpAdapterInterface } from '../../../adapter/DomainHttpAdapter';
import VocabularyCommand, { vocabularyCommandToDomain } from '../../../command/VocabularyCommand';
import Vocabulary from '../../entities/Vocabulary';
import UpdateVocabularyUsecaseInterface, {
    UpdateVocabularyCommand,
} from '../../interfaces/vocabulary/UpdateVocabularyUsecase.interface';

class UpdateVocabularyUsecase implements UpdateVocabularyUsecaseInterface {
    constructor(private readonly domainHttpAdapter: HttpAdapterInterface) {}

    async execute(id: string, command: UpdateVocabularyCommand): Promise<Vocabulary | Error> {
        try {
            const formData: UpdateVocabularyCommand = {
                translation: command.translation,
                word: command.word,
                deletePronunciationWord: command.deletePronunciationWord,
                deletePronunciationTranslation: command.deletePronunciationTranslation,
            };
            if (command.wordPronunciation) {
                formData.wordPronunciation = command.wordPronunciation;
            }
            if (command.translationPronunciation) {
                formData.translationPronunciation = command.translationPronunciation;
            }

            const httpResponse: HttpResponse<VocabularyCommand> = await this.domainHttpAdapter.post(
                `/vocabulary/${id}/`,
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

export default UpdateVocabularyUsecase;
