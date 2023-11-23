import User from './User';

type Report = {
    id: string;
    category: { id: string; name: string };
    content: string;
    user: User;
    status: ReportStatus;
    comment?: string;
};

export enum ReportStatus {
    OPEN = 'OPEN',
    IN_PROGRESS = 'IN_PROGRESS',
    CLOSED = 'CLOSED',
}

export default Report;
