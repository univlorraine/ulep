import { HttpResponse } from '../../../adapter/BaseHttpAdapter';
import { HttpAdapterInterface } from '../../../adapter/DomainHttpAdapter';
import { LogEntryByDateCommand, logEntryByDateCommandToDomain } from '../../../command/LogEntryCommand';
import { LogEntriesByDates } from '../../entities/LogEntry';
import { DEFAULT_LOG_ENTRIES_BY_DATE_PAGE_SIZE } from '../../interfaces/log-entries/GetLogEntriesByDateUsecase.interface';
import GetLogEntriesUsecaseInterface, {
    GetLogEntriesUsecaseParams,
} from '../../interfaces/log-entries/GetLogEntriesUsecase.interface';

class GetLogEntriesUsecase implements GetLogEntriesUsecaseInterface {
    constructor(private readonly domainHttpAdapter: HttpAdapterInterface) {}

    async execute(params: GetLogEntriesUsecaseParams): Promise<LogEntriesByDates[] | Error> {
        try {
            const httpResponse: HttpResponse<LogEntryByDateCommand[]> = await this.domainHttpAdapter.get(
                `/log-entries/learning-language/${params.learningLanguageId}/grouped-by-dates?page=${params.page}&limit=${DEFAULT_LOG_ENTRIES_BY_DATE_PAGE_SIZE}`
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
