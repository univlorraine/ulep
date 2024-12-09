import { HttpResponse } from '../../../adapter/BaseHttpAdapter';
import { HttpAdapterInterface } from '../../../adapter/DomainHttpAdapter';
import FileAdapterInterface from '../../../adapter/interfaces/FileAdapter.interface';
import ExportLogEntriesUsecaseInterface from '../../interfaces/log-entries/ExportLogEntriesUsecase.interface';

class ExportLogEntriesUsecase implements ExportLogEntriesUsecaseInterface {
    constructor(
        private readonly domainHttpAdapter: HttpAdapterInterface,
        private readonly fileAdapter: FileAdapterInterface
    ) {}

    async execute(learningLanguageId: string): Promise<void | Error> {
        try {
            const httpResponse: HttpResponse<Blob> = await this.domainHttpAdapter.get(
                `/log-entries/export/${learningLanguageId}`
            );

            if (!httpResponse.parsedBody) {
                return new Error('errors.global');
            }

            return await this.fileAdapter.saveBlob(httpResponse.parsedBody, `log_entries.csv`);
        } catch (error: any) {
            console.error(error);
            return new Error('errors.global');
        }
    }
}

export default ExportLogEntriesUsecase;
