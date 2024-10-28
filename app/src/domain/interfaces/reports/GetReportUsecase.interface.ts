import Report from '../../entities/Report';

interface GetReportUsecaseInterface {
    execute(id: string): Promise<Report | Error>;
}
export default GetReportUsecaseInterface;
