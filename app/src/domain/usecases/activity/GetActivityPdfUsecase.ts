import { HttpResponse } from '../../../adapter/BaseHttpAdapter';
import { HttpAdapterInterface } from '../../../adapter/DomainHttpAdapter';
import FileAdapterInterface from '../../../adapter/interfaces/FileAdapter.interface';
import { Activity } from '../../entities/Activity';
import GetActivityPdfUsecaseInterface from '../../interfaces/activity/GetActivityPdfUsecase.interface';

class GetActivityPdfUsecase implements GetActivityPdfUsecaseInterface {
    constructor(
        private readonly domainHttpAdapter: HttpAdapterInterface,
        private readonly fileService: FileAdapterInterface
    ) {}

    async execute(activity: Activity): Promise<void | Error> {
        const httpResponse: HttpResponse<Blob> = await this.domainHttpAdapter.get(`/activities/pdf/${activity.id}`, {});

        if (!httpResponse.parsedBody) {
            return new Error('errors.global');
        }

        const fileName = `${activity.title
            .trim()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[^a-zA-Z0-9]/g, '-')
            .replace(/-+/g, '-')
            .toLowerCase()}.pdf`;

        this.fileService.saveBlob(httpResponse.parsedBody, fileName);
    }
}

export default GetActivityPdfUsecase;
