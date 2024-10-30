import { HttpResponse } from '../../../adapter/BaseHttpAdapter';
import { HttpAdapterInterface } from '../../../adapter/DomainHttpAdapter';
import { CollectionCommand } from '../../../command/CollectionCommand';
import ReportCommand, { reportCommandToDomain } from '../../../command/ReportCommand';
import Report from '../../entities/Report';
import GetAllReportsUsecaseInterface from '../../interfaces/reports/GetAllReportsUsecase.interface';

class GetAllReportsUsecase implements GetAllReportsUsecaseInterface {
    constructor(private readonly domainHttpAdapter: HttpAdapterInterface) {}

    async execute(userId: string): Promise<Report[] | Error> {
        try {
            const httpResponse: HttpResponse<CollectionCommand<ReportCommand>> = await this.domainHttpAdapter.get(
                `/reports/profile/${userId}`
            );

            if (!httpResponse.parsedBody) {
                return new Error('errors.global');
            }
            return httpResponse.parsedBody.items.map(reportCommandToDomain);
        } catch (error: any) {
            return new Error('errors.global');
        }
    }
}

export default GetAllReportsUsecase;
