import { HttpResponse } from '../../../adapter/BaseHttpAdapter';
import { HttpAdapterInterface } from '../../../adapter/DomainHttpAdapter';
import ReportCommand, { reportCommandToDomain } from '../../../command/ReportCommand';
import Report from '../../entities/Report';
import UpdateReportStatusUsecaseInterface, {
    UpdateReportStatusCommand,
} from '../../interfaces/reports/UpdateReportStatusUsecase.interface';

class UpdateReportStatusUsecase implements UpdateReportStatusUsecaseInterface {
    constructor(private readonly domainHttpAdapter: HttpAdapterInterface) {}

    async execute(id: string, command: UpdateReportStatusCommand): Promise<Report | Error> {
        try {
            const httpResponse: HttpResponse<ReportCommand> = await this.domainHttpAdapter.put(`/reports/${id}/`, {
                status: command.status,
                comment: command.comment,
            });

            if (!httpResponse.parsedBody) {
                return new Error('errors.global');
            }

            const report = reportCommandToDomain(httpResponse.parsedBody);

            return report;
        } catch (error: any) {
            return new Error('errors.global');
        }
    }
}

export default UpdateReportStatusUsecase;
