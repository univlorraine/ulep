import { MessageType } from '../entities/chat/Message';

interface CreateReportMessageUsecaseInterface {
    execute(content: string, reportedUserId: string, filePath?: string, mediaType?: MessageType): Promise<void | Error>;
}
export default CreateReportMessageUsecaseInterface;
