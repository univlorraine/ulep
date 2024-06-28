import { HttpResponse } from '../../adapter/BaseHttpAdapter';
import { HttpAdapterInterface } from '../../adapter/DomainHttpAdapter';
import { MessageWithoutSenderCommand, messageWithoutSenderCommandToDomain } from '../../command/MessageCommand';
import { MessageWithoutSender } from '../entities/chat/Message';
import SendMessageUsecaseInterface from '../interfaces/chat/SendMessageUsecase.interface';

type MessagePayload = {
    content?: string;
    senderId: string;
    file?: File;
    filename?: string;
};

class SendMessageUsecase implements SendMessageUsecaseInterface {
    constructor(private readonly chatHttpAdapter: HttpAdapterInterface) {}

    async execute(
        conversationId: string,
        senderId: string,
        content?: string,
        file?: File,
        filename?: string
    ): Promise<MessageWithoutSender | Error> {
        try {
            const body: MessagePayload = {
                content,
                senderId,
            };

            if (file) {
                body.file = file;
            }

            if (filename) {
                body.filename = filename;
            }

            const httpResponse: HttpResponse<MessageWithoutSenderCommand> = await this.chatHttpAdapter.post(
                '/conversations/' + conversationId + '/message',
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
