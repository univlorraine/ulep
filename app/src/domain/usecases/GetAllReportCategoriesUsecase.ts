import { HttpResponse } from '../../adapter/BaseHttpAdapter';
import { HttpAdapterInterface } from '../../adapter/DomainHttpAdapter';
import ReportCategoryCommand, { reportCategoriesCommandToDomain } from '../../command/ReportCategoryCommand';
import ReportCategory from '../entities/ReportCategory';
import GetAllReportCategoriesUsecaseInterface from '../interfaces/GetAlllReportCategoriesUsecase.interface';

// TODO(herve): Add language code to the Accept-Language header
class GetAllReportCategoriesUsecase implements GetAllReportCategoriesUsecaseInterface {
    constructor(private readonly domainHttpAdapter: HttpAdapterInterface) {}

    async execute(): Promise<ReportCategory[] | Error> {
        try {
            const httpResponse: HttpResponse<ReportCategoryCommand[]> = await this.domainHttpAdapter.get(
                `/reports/categories`
            );

            if (!httpResponse.parsedBody) {
                return new Error('errors.global');
            }

            return reportCategoriesCommandToDomain(httpResponse.parsedBody);
        } catch (error: any) {
            return new Error('errors.global');
        }
    }
}

export default GetAllReportCategoriesUsecase;
