import { HttpResponse } from '../../../adapter/BaseHttpAdapter';
import { HttpAdapterInterface } from '../../../adapter/DomainHttpAdapter';
import { LogEntryByDateCommand } from '../../../command/LogEntryCommand';
import ShareLogEntriesUsecaseInterface from '../../interfaces/log-entries/ShareLogEntriesUsecase.interface';

class ShareLogEntriesUsecase implements ShareLogEntriesUsecaseInterface {
    constructor(private readonly domainHttpAdapter: HttpAdapterInterface) {}

    async execute(learningLanguageId: string): Promise<void | Error> {
        try {
            const httpResponse: HttpResponse<LogEntryByDateCommand[]> = await this.domainHttpAdapter.post(
                `/log-entries/share/${learningLanguageId}`,
                {}
            );

            if (!httpResponse.parsedBody) {
                return new Error('errors.global');
            }

            return;
        } catch (error: any) {
            return new Error('errors.global');
        }
    }
}

export default ShareLogEntriesUsecase;
