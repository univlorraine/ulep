import { HttpResponse } from '../../../adapter/BaseHttpAdapter';
import { HttpAdapterInterface } from '../../../adapter/DomainHttpAdapter';
import { LogEntryByDateCommand } from '../../../command/LogEntryCommand';
import ShareLogEntriesForResearchUsecaseInterface from '../../interfaces/log-entries/ShareForResearchLogEntriesUsecase.interface';

class ShareForResearchLogEntriesUsecase implements ShareLogEntriesForResearchUsecaseInterface {
    constructor(private readonly domainHttpAdapter: HttpAdapterInterface) {}

    async execute(learningLanguageId: string): Promise<void | Error> {
        try {
            const httpResponse: HttpResponse<LogEntryByDateCommand[]> = await this.domainHttpAdapter.post(
                `/log-entries/share-for-research/${learningLanguageId}`,
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

export default ShareForResearchLogEntriesUsecase;
