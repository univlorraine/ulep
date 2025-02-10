import { HttpResponse } from '../../../adapter/BaseHttpAdapter';
import { HttpAdapterInterface } from '../../../adapter/DomainHttpAdapter';
import { LogEntryByDateCommand } from '../../../command/LogEntryCommand';
import UnshareLogEntriesUsecaseInterface from '../../interfaces/log-entries/UnshareLogEntriesUsecase.interface';

class UnshareLogEntriesUsecase implements UnshareLogEntriesUsecaseInterface {
    constructor(private readonly domainHttpAdapter: HttpAdapterInterface) {}

    async execute(learningLanguageId: string): Promise<void | Error> {
        try {
            const httpResponse: HttpResponse<LogEntryByDateCommand[]> = await this.domainHttpAdapter.post(
                `/log-entries/unshare/${learningLanguageId}`,
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

export default UnshareLogEntriesUsecase;
