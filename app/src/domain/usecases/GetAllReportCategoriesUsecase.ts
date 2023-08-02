import { HttpResponse } from '../../adapter/BaseHttpAdapter';
import { HttpAdapterInterface } from '../../adapter/DomainHttpAdapter';
import { CollectionCommand } from '../../command/CollectionCommand';
import ReportCategoryCommand, { reportCategoriesCommandToDomain } from '../../command/ReportCategoryCommand';
import ReportCategory from '../entities/ReportCategory';
import GetAllReportCategoriesUsecaseInterface from '../interfaces/GetAlllReportCategoriesUsecase.interface';

class GetAllReportCategoriesUsecase implements GetAllReportCategoriesUsecaseInterface {
    constructor(private readonly domainHttpAdapter: HttpAdapterInterface) {}

    async execute(): Promise<ReportCategory[] | Error> {
        try {
            const httpResponse: HttpResponse<CollectionCommand<ReportCategoryCommand>> =
                await this.domainHttpAdapter.get(`/report-categories`);

            if (!httpResponse.parsedBody || !httpResponse.parsedBody.items) {
                return new Error('errors.global');
            }

            return reportCategoriesCommandToDomain(httpResponse.parsedBody.items);
        } catch (error: any) {
            return new Error('errors.global');
        }
    }
}

export default GetAllReportCategoriesUsecase;
