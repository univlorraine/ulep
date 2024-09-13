import { HttpResponse } from '../../adapter/BaseHttpAdapter';
import { HttpAdapterInterface } from '../../adapter/DomainHttpAdapter';
import { MessageType } from '../entities/chat/Message';
import CreateReportMessageUsecaseInterface from '../interfaces/CreateReportMessageUsecase.interface';

class CreateReportMessageUsecase implements CreateReportMessageUsecaseInterface {
    constructor(private readonly domainHttpAdapter: HttpAdapterInterface) {}

    async execute(
        content: string,
        reportedUserId: string,
        filePath?: string,
        mediaType?: MessageType
    ): Promise<undefined | Error> {
        try {
            const httpResponse: HttpResponse<undefined> = await this.domainHttpAdapter.post(`/reports/message`, {
                content,
                filePath,
                mediaType,
                reportedUserId,
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
