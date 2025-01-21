import { HttpResponse } from '../../adapter/BaseHttpAdapter';
import { HttpAdapterInterface } from '../../adapter/DomainHttpAdapter';
import CreateReportMessageUsecaseInterface, {
    CreateReportMessageParams,
} from '../interfaces/CreateReportMessageUsecase.interface';

class CreateReportMessageUsecase implements CreateReportMessageUsecaseInterface {
    constructor(private readonly domainHttpAdapter: HttpAdapterInterface) {}

    async execute(params: CreateReportMessageParams): Promise<undefined | Error> {
        try {
            const httpResponse: HttpResponse<undefined> = await this.domainHttpAdapter.post(`/reports/message`, {
                content: params.content,
                filePath: params.filePath,
                mediaType: params.mediaType,
                reportedUserId: params.reportedUserId,
                messageId: params.messageId,
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

export default CreateReportMessageUsecase;
