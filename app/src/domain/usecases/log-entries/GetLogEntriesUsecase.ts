import { HttpResponse } from '../../../adapter/BaseHttpAdapter';
import { HttpAdapterInterface } from '../../../adapter/DomainHttpAdapter';
import { LogEntryByDateCommand, logEntryByDateCommandToDomain } from '../../../command/LogEntryCommand';
import { LogEntriesByDates } from '../../entities/LogEntry';
import GetLogEntriesUsecaseInterface from '../../interfaces/log-entries/GetLogEntriesUsecase.interface';

class GetLogEntriesUsecase implements GetLogEntriesUsecaseInterface {
    constructor(private readonly domainHttpAdapter: HttpAdapterInterface) {}

    async execute(userId: string): Promise<LogEntriesByDates[] | Error> {
        try {
            const httpResponse: HttpResponse<LogEntryByDateCommand[]> = await this.domainHttpAdapter.get(
                `/log-entries/user/${userId}/grouped-by-dates`
            );

            if (!httpResponse.parsedBody) {
                return new Error('errors.global');
            }

            return httpResponse.parsedBody.map(logEntryByDateCommandToDomain);
        } catch (error: any) {
            return new Error('errors.global');
        }
    }
}

export default GetLogEntriesUsecase;
