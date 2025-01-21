import { MessageType } from './Message';
import User from './User';

type MetadataReport = {
    filePath?: string;
    mediaType?: MessageType;
    messageId?: string;
    isMessageDeleted?: boolean;
};

type Report = {
    id: string;
    category: { id: string; name: string };
    content: string;
    user: User;
    status: ReportStatus;
    comment?: string;
    metadata: MetadataReport;
};

export const CONVERSATION_CATEGORY = 'Conversation';

export enum ReportStatus {
    OPEN = 'OPEN',
    IN_PROGRESS = 'IN_PROGRESS',
    CLOSED = 'CLOSED',
}

export default Report;
