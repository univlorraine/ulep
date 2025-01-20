import { HttpResponse } from '../../../adapter/BaseHttpAdapter';
import { HttpAdapterInterface } from '../../../adapter/DomainHttpAdapter';
import FileAdapterInterface from '../../../adapter/interfaces/FileAdapter.interface';
import GetActivityPdfUsecaseInterface from '../../interfaces/activity/GetActivityPdfUsecase.interface';

class GetActivityPdfUsecase implements GetActivityPdfUsecaseInterface {
    constructor(
        private readonly domainHttpAdapter: HttpAdapterInterface,
        private readonly fileService: FileAdapterInterface
    ) {}

    async execute(id: string): Promise<void | Error> {
        const httpResponse: HttpResponse<Blob> = await this.domainHttpAdapter.get(`/activities/pdf/${id}`, {});

        if (!httpResponse.parsedBody) {
            return new Error('errors.global');
        }

        this.fileService.saveBlob(httpResponse.parsedBody, 'activity.pdf');
    }
}

export default GetActivityPdfUsecase;
