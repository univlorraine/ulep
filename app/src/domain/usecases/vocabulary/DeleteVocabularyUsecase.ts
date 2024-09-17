import { HttpResponse } from '../../../adapter/BaseHttpAdapter';
import { HttpAdapterInterface } from '../../../adapter/DomainHttpAdapter';
import DeleteVocabularyUsecaseInterface from '../../interfaces/vocabulary/DeleteVocabularyUsecase.interface';

class DeleteVocabularyUsecase implements DeleteVocabularyUsecaseInterface {
    constructor(private readonly domainHttpAdapter: HttpAdapterInterface) {}

    async execute(id: string): Promise<void | Error> {
        try {
            const httpResponse: HttpResponse<void> = await this.domainHttpAdapter.delete(`/vocabulary/${id}/`);

            if (!httpResponse.parsedBody) {
                return new Error('errors.global');
            }

            return;
        } catch (error: any) {
            return new Error('errors.global');
        }
    }
}

export default DeleteVocabularyUsecase;
