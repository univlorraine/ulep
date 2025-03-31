import ReportCategory from './ReportCategory';
import ReportMetadata from './ReportMetadata';
export enum ReportStatus {
    OPEN = 'OPEN',
    IN_PROGRESS = 'IN_PROGRESS',
    CLOSED = 'CLOSED',
    CANCELLED = 'CANCELLED',
    TREATED = 'TREATED',
}

export enum ReportCategoryName {
    CONVERSATION = 'Conversation',
    BEHAVIOR = 'Signaler un comportement',
    SUGGESTION = 'Suggestion',
    OTHER = 'Autre',
}

class Report {
    constructor(
        public id: string,
        public category: ReportCategory,
        public status: ReportStatus,
        public content: string,
        public createdAt: Date,
        public comment: string,
        public metadata: ReportMetadata
    ) {}
}

export default Report;
