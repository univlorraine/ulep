import { HttpResponse } from '../../adapter/BaseHttpAdapter';
import { HttpAdapterInterface } from '../../adapter/DomainHttpAdapter';
import { MessageWithoutSenderCommand, messageWithoutSenderCommandToDomain } from '../../command/MessageCommand';
import { MessageType, MessageWithoutSender } from '../entities/chat/Message';
import SendMessageUsecaseInterface, {
    SendMessageUsecasePayload,
} from '../interfaces/chat/SendMessageUsecase.interface';

type MessagePayload = {
    content?: string;
    senderId: string;
    file?: File;
    filename?: string;
    type?: MessageType;
    parentId?: string;
};

class SendMessageUsecase implements SendMessageUsecaseInterface {
    constructor(private readonly chatHttpAdapter: HttpAdapterInterface) {}

    async execute(payload: SendMessageUsecasePayload): Promise<MessageWithoutSender | Error> {
        try {
            const body: MessagePayload = {
                content: payload.content,
                senderId: payload.senderId,
            };

            if (payload.file) {
                body.file = payload.file;
            }

            if (payload.filename) {
                body.filename = payload.filename;
            }

            if (payload.type) {
                body.type = payload.type;
            }

            if (payload.parentId) {
                body.parentId = payload.parentId;
            }

            const httpResponse: HttpResponse<MessageWithoutSenderCommand> = await this.chatHttpAdapter.post(
                '/conversations/' + payload.conversationId + '/message',
                body,
                {},
                'multipart/form-data'
            );

            if (!httpResponse.parsedBody) {
                return new Error('errors.global');
            }

            return messageWithoutSenderCommandToDomain(httpResponse.parsedBody);
        } catch (error: any) {
            return new Error('errors.global');
        }
    }
}

export default SendMessageUsecase;
