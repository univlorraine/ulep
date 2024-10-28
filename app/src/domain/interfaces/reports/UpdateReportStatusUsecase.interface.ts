import Report, { ReportStatus } from '../../entities/Report';

export type UpdateReportStatusCommand = {
    status: ReportStatus;
    comment?: string;
};

interface UpdateReportStatusUsecaseInterface {
    execute(id: string, command: UpdateReportStatusCommand): Promise<Report | Error>;
}

export default UpdateReportStatusUsecaseInterface;
