import { HttpResponse } from '../../adapter/BaseHttpAdapter';
import { HttpAdapterInterface } from '../../adapter/DomainHttpAdapter';
import CreateReportUsecaseInterface from '../interfaces/CreateReportUsecase.interface';

class CreateReportUsecase implements CreateReportUsecaseInterface {
    constructor(private readonly domainHttpAdapter: HttpAdapterInterface) {}

    async execute(content: string): Promise<undefined | Error> {
        try {
            const httpResponse: HttpResponse<undefined> = await this.domainHttpAdapter.post(`/reports/message`, {
                content,
            });

            if (!httpResponse.parsedBody) {
                return new Error('errors.global');
            }

            return;
        } catch (error: any) {
            return new Error('errors.global');
        }
    }
}

export default CreateReportUsecase;
