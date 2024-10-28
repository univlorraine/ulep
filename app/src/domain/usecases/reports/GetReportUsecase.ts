import { HttpResponse } from '../../../adapter/BaseHttpAdapter';
import { HttpAdapterInterface } from '../../../adapter/DomainHttpAdapter';
import ReportCommand, { reportCommandToDomain } from '../../../command/ReportCommand';
import Report from '../../entities/Report';
import GetAllReportsUsecaseInterface from '../../interfaces/reports/GetReportUsecase.interface';

class GetReportUsecase implements GetAllReportsUsecaseInterface {
    constructor(private readonly domainHttpAdapter: HttpAdapterInterface) {}

    async execute(id: string): Promise<Report | Error> {
        try {
            const httpResponse: HttpResponse<ReportCommand> = await this.domainHttpAdapter.get(`/reports/${id}`);

            if (!httpResponse.parsedBody) {
                return new Error('errors.global');
            }
            return reportCommandToDomain(httpResponse.parsedBody);
        } catch (error: any) {
            return new Error('errors.global');
        }
    }
}

export default GetReportUsecase;
