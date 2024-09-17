import { HttpResponse } from '../../../adapter/BaseHttpAdapter';
import { HttpAdapterInterface } from '../../../adapter/DomainHttpAdapter';
import DeleteVocabularyListUsecaseInterface from '../../interfaces/vocabulary/DeleteVocabularyListUsecase.interface';

class DeleteVocabularyListUsecase implements DeleteVocabularyListUsecaseInterface {
    constructor(private readonly domainHttpAdapter: HttpAdapterInterface) {}

    async execute(id: string): Promise<void | Error> {
        try {
            const httpResponse: HttpResponse<void> = await this.domainHttpAdapter.delete(`/vocabulary/list/${id}/`);

            if (!httpResponse.parsedBody) {
                return new Error('errors.global');
            }

            return;
        } catch (error: any) {
            return new Error('errors.global');
        }
    }
}

export default DeleteVocabularyListUsecase;
