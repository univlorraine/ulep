import Report from '../../entities/Report';

interface GetAllReportsUsecaseInterface {
    execute(profileId: string): Promise<Report[] | Error>;
}
export default GetAllReportsUsecaseInterface;
