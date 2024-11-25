import { HttpResponse } from '../../adapter/BaseHttpAdapter';
import { HttpAdapterInterface } from '../../adapter/DomainHttpAdapter';
import ExportMediasFromConversationUsecaseInterface from '../interfaces/chat/ExportMediasFromConversationUsecase.interface';

class ExportMediasFromConversationUsecase implements ExportMediasFromConversationUsecaseInterface {
    constructor(private readonly chatHttpAdapter: HttpAdapterInterface) {}

    async execute(id: string): Promise<void | Error> {
        try {
            const httpResponse: HttpResponse<Response> = await this.chatHttpAdapter.get(
                `/conversations/${id}/export/medias`
            );

            const buffer: Uint8Array<ArrayBufferLike> = new Uint8Array();
            const reader = httpResponse.body?.getReader();

            async function readFile() {
                const streamResult = await reader?.read();

                if (!streamResult) return buffer;

                const { done, value } = streamResult;
                buffer.push(value);

                if (done) return buffer;

                await readFile();
            }

            const read = await reader?.read();

            console.log({ read });

            // const link = document.createElement('a');
            // link.href = URL.createObjectURL(blob);
            // link.download = 'test.zip';
            // link.click();
            // link.remove();

            // console.log({ blob });
        } catch (error: any) {
            return new Error('errors.global');
        }
    }
}

export default ExportMediasFromConversationUsecase;
