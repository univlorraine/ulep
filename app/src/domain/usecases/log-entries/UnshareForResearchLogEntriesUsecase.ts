import { HttpResponse } from '../../../adapter/BaseHttpAdapter';
import { HttpAdapterInterface } from '../../../adapter/DomainHttpAdapter';
import { LogEntryByDateCommand } from '../../../command/LogEntryCommand';
import UnshareLogEntriesForResearchUsecaseInterface from '../../interfaces/log-entries/UnshareForResearchLogEntriesUsecase.interface';

class UnshareLogEntriesForResearchUsecase implements UnshareLogEntriesForResearchUsecaseInterface {
    constructor(private readonly domainHttpAdapter: HttpAdapterInterface) {}

    async execute(learningLanguageId: string): Promise<void | Error> {
        try {
            const httpResponse: HttpResponse<LogEntryByDateCommand[]> = await this.domainHttpAdapter.post(
                `/log-entries/unshare-for-research/${learningLanguageId}`,
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

export default UnshareLogEntriesForResearchUsecase;
