import { HttpResponse } from '../../../adapter/BaseHttpAdapter';
import { HttpAdapterInterface } from '../../../adapter/DomainHttpAdapter';
import { CollectionCommand } from '../../../command/CollectionCommand';
import LogEntryCommand, { logEntryCommandToDomain } from '../../../command/LogEntryCommand';
import { LogEntry } from '../../entities/LogEntry';
import GetLogEntriesByDateUsecaseInterface from '../../interfaces/log-entries/GetLogEntriesByDateUsecase.interface';

class GetLogEntriesByDateUsecase implements GetLogEntriesByDateUsecaseInterface {
    constructor(private readonly domainHttpAdapter: HttpAdapterInterface) {}

    async execute(userId: string, date: Date): Promise<LogEntry[] | Error> {
        try {
            const httpResponse: HttpResponse<CollectionCommand<LogEntryCommand>> = await this.domainHttpAdapter.get(
                `/log-entries/user/${userId}?date=${date.toISOString()}`
            );

            if (!httpResponse.parsedBody || !httpResponse.parsedBody.items) {
                return new Error('errors.global');
            }

            return httpResponse.parsedBody.items.map(logEntryCommandToDomain);
        } catch (error: any) {
            return new Error('errors.global');
        }
    }
}

export default GetLogEntriesByDateUsecase;
