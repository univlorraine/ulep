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
            const formData = new FormData();
            if (command.translation) {
                formData.append('translation', command.translation);
            }

            if (command.word) {
                formData.append('word', command.word);
            }

            if (command.pronunciationWord) {
                formData.append('pronunciationWord', command.pronunciationWord);
            }
            if (command.pronunciationTranslation) {
                formData.append('pronunciationTranslation', command.pronunciationTranslation);
            }

            const httpResponse: HttpResponse<VocabularyCommand> = await this.domainHttpAdapter.put(
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
