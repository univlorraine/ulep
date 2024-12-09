import { HttpResponse } from '../../adapter/BaseHttpAdapter';
import { HttpAdapterInterface } from '../../adapter/DomainHttpAdapter';
import ExportMediasFromConversationUsecaseInterface from '../interfaces/chat/ExportMediasFromConversationUsecase.interface';

class ExportMediasFromConversationUsecase implements ExportMediasFromConversationUsecaseInterface {
    constructor(private readonly chatHttpAdapter: HttpAdapterInterface) {}

    async execute(id: string): Promise<Blob | Error> {
        try {
            const httpResponse: HttpResponse<Response> = await this.chatHttpAdapter.get(
                `/conversations/${id}/export/medias`
            );

            const blob = await httpResponse.blob();

            return new Blob([blob]);
        } catch (error: any) {
            return new Error('errors.global');
        }
    }
}

export default ExportMediasFromConversationUsecase;
