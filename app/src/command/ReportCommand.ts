import Report, { ReportStatus } from '../domain/entities/Report';
import ReportCategory from '../domain/entities/ReportCategory';
import ReportMetadata from '../domain/entities/ReportMetadata';

interface ReportCommand {
    id: string;
    category: ReportCategory;
    status: ReportStatus;
    content: string;
    createdAt: Date;
    comment: string;
    metadata: ReportMetadata;
}

export const reportCommandToDomain = (command: ReportCommand) => {
    return new Report(
        command.id,
        command.category,
        command.status,
        command.content,
        command.createdAt,
        command.comment,
        command.metadata
    );
};

export default ReportCommand;
