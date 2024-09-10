import { HttpResponse } from '../../../adapter/BaseHttpAdapter';
import { HttpAdapterInterface } from '../../../adapter/DomainHttpAdapter';
import FileAdapterInterface from '../../../adapter/interfaces/FileAdapter.interface';
import GetVocabularyListPdfUsecaseInterface from '../../interfaces/vocabulary/GetVocabularyListPdfUsecase.interface';

class GetVocabularyListPdfUsecase implements GetVocabularyListPdfUsecaseInterface {
    constructor(
        private readonly domainHttpAdapter: HttpAdapterInterface,
        private readonly fileService: FileAdapterInterface
    ) {}

    async execute(vocabularyListId: string): Promise<void | Error> {
        try {
            const httpResponse: HttpResponse<Blob> = await this.domainHttpAdapter.get(
                `/vocabulary/pdf/${vocabularyListId}`,
                {}
            );

            if (!httpResponse.parsedBody) {
                return new Error('errors.global');
            }

            this.fileService.saveBlob(httpResponse.parsedBody, 'vocabulary-list.pdf');
        } catch (error: any) {
            console.error(error);
            return new Error('errors.global');
        }
    }
}

export default GetVocabularyListPdfUsecase;
