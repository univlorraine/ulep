import { MessageType } from '../entities/chat/Message';

export type CreateReportMessageParams = {
    content: string;
    reportedUserId: string;
    filePath?: string;
    mediaType?: MessageType;
    messageId?: string;
};

interface CreateReportMessageUsecaseInterface {
    execute(params: CreateReportMessageParams): Promise<void | Error>;
}
export default CreateReportMessageUsecaseInterface;
