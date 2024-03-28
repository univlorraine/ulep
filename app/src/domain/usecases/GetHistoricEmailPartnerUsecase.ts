import { HttpResponse } from '../../adapter/BaseHttpAdapter';
import { HttpAdapterInterface } from '../../adapter/DomainHttpAdapter';
import GetHistoricEmailPartnerUsecaseInterface from '../interfaces/GetHistoricEmailPartnerUsecase.interface';

class GetHistoricEmailPartnerUsecase implements GetHistoricEmailPartnerUsecaseInterface {
    constructor(private readonly domainHttpAdapter: HttpAdapterInterface) {}

    async execute(userId: string, languageId: string): Promise<string | undefined> {
        try {
            const httpResponse: HttpResponse<{ email: string | undefined }> = await this.domainHttpAdapter.get(
                `/tandem-history/partner-email?userId=${userId}&languageId=${languageId}`
            );

            if (!httpResponse.parsedBody || !httpResponse.parsedBody.email) {
                return undefined;
            }

            return httpResponse.parsedBody.email;
        } catch (error: any) {
            return undefined;
        }
    }
}

export default GetHistoricEmailPartnerUsecase;
