import { HttpResponse } from '../../../adapter/BaseHttpAdapter';
import { HttpAdapterInterface } from '../../../adapter/DomainHttpAdapter';
import { CollectionCommand } from '../../../command/CollectionCommand';
import LogEntryCommand, { logEntryCommandToDomain } from '../../../command/LogEntryCommand';
import { LogEntry } from '../../entities/LogEntry';
import GetLogEntriesByDateUsecaseInterface, {
    DEFAULT_LOG_ENTRIES_BY_DATE_PAGE_SIZE,
    GetLogEntriesByDateUsecaseParams,
} from '../../interfaces/log-entries/GetLogEntriesByDateUsecase.interface';

class GetLogEntriesByDateUsecase implements GetLogEntriesByDateUsecaseInterface {
    constructor(private readonly domainHttpAdapter: HttpAdapterInterface) {}

    async execute(params: GetLogEntriesByDateUsecaseParams): Promise<LogEntry[] | Error> {
        try {
            const httpResponse: HttpResponse<CollectionCommand<LogEntryCommand>> = await this.domainHttpAdapter.get(
                `/log-entries/learning-language/${params.learningLanguageId}?date=${params.date.toISOString()}&page=${params.page}&limit=${DEFAULT_LOG_ENTRIES_BY_DATE_PAGE_SIZE}`
            );

            if (!httpResponse.parsedBody || !httpResponse.parsedBody.items) {
                return new Error('errors.global');
            }

            return httpResponse.parsedBody.items
                .map(logEntryCommandToDomain)
                .filter((entry): entry is LogEntry => entry !== undefined);
        } catch (error: any) {
            return new Error('errors.global');
        }
    }
}

export default GetLogEntriesByDateUsecase;
