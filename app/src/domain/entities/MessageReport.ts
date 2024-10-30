import { MessageType } from './chat/Message';
import ReportMetadata from './ReportMetadata';
export enum ReportStatus {
    OPEN = 'OPEN',
    IN_PROGRESS = 'IN_PROGRESS',
    CLOSED = 'CLOSED',
    CANCELLED = 'CANCELLED',
}

class MessageReport {
    constructor(
        public id: string,
        public content: string,
        public type: MessageType,
        public metadata: ReportMetadata
    ) {}

    public getThumbnail(): string | undefined {
        if (this.type === MessageType.Image) {
            return this.metadata.filePath ?? this.content;
        }
        return undefined;
    }
}

export default MessageReport;
