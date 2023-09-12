import ReportCategory from '../entities/ReportCategory';

interface GetAllReportCategoriesUsecaseInterface {
    execute(): Promise<ReportCategory[] | Error>;
}
export default GetAllReportCategoriesUsecaseInterface;
