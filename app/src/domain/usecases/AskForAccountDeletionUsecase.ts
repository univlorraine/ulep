import { HttpResponse } from '../../adapter/BaseHttpAdapter';
import { HttpAdapterInterface } from '../../adapter/DomainHttpAdapter';

class AskForAccountDeletion implements AskForAccountDeletion {
    constructor(private readonly domainHttpAdapter: HttpAdapterInterface) {}

    async execute(): Promise<void | Error> {
        try {
            const httpResponse: HttpResponse<void> = await this.domainHttpAdapter.post(`/reports/unsubscribe`, {});

            if (!httpResponse.parsedBody) {
                return new Error('errors.global');
            }
            return;
        } catch (error: any) {
            return new Error('errors.global');
        }
    }
}

export default AskForAccountDeletion;
