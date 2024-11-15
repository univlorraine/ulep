import { HttpResponse } from '../../../adapter/BaseHttpAdapter';
import { HttpAdapterInterface } from '../../../adapter/DomainHttpAdapter';
import { ActivityCommand } from '../../../command/ActivityCommand';
import UpdateCustomLogEntryUsecaseInterface from '../../interfaces/log-entries/UpdateCustomLogEntryUsecase.interface';

class UpdateCustomLogEntryUsecase implements UpdateCustomLogEntryUsecaseInterface {
    constructor(private readonly domainHttpAdapter: HttpAdapterInterface) {}

    async execute(id: string, content: string): Promise<void | Error> {
        try {
            const httpResponse: HttpResponse<ActivityCommand> = await this.domainHttpAdapter.put(`/log-entries/${id}`, {
                content,
            });

            if (!httpResponse.parsedBody) {
                return new Error('errors.global');
            }

            return;
        } catch (error: any) {
            return new Error('errors.global');
        }
    }
}

export default UpdateCustomLogEntryUsecase;
