import { HttpResponse } from '../../../adapter/BaseHttpAdapter';
import { HttpAdapterInterface } from '../../../adapter/DomainHttpAdapter';
import VocabularyListCommand from '../../../command/VocabularyListCommand';
import AddReaderToVocabularyListUsecaseInterface, {
    AddReaderToVocabularyListCommand,
} from '../../interfaces/vocabulary/AddReaderToVocabularyListUsecase.interface';

class AddReaderToVocabularyListUsecase implements AddReaderToVocabularyListUsecaseInterface {
    constructor(private readonly domainHttpAdapter: HttpAdapterInterface) {}

    async execute(command: AddReaderToVocabularyListCommand): Promise<void | Error> {
        try {
            const httpResponse: HttpResponse<VocabularyListCommand> = await this.domainHttpAdapter.put(
                `/vocabulary/list/${command.vocabularyListId}/reader/${command.profileId}`,
                {}
            );

            if (!httpResponse.parsedBody) {
                return new Error('errors.global');
            }

            return;
        } catch (error: any) {
            return new Error('errors.global');
        }
    }
}

export default AddReaderToVocabularyListUsecase;
