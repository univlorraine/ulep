import { MessageType } from '../entities/chat/Message';

interface CreateReportMessageUsecaseInterface {
    execute(content: string, filePath?: string, mediaType?: MessageType): Promise<void | Error>;
}
export default CreateReportMessageUsecaseInterface;
