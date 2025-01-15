import { HttpResponse } from '../../../adapter/BaseHttpAdapter';
import { HttpAdapterInterface } from '../../../adapter/DomainHttpAdapter';
import { CollectionCommand } from '../../../command/CollectionCommand';
import { EventCommand, eventCommandToDomain } from '../../../command/EventCommand';
import EventObject from '../../entities/Event';
import GetAllEventsUsecaseInterface, { GetEventsQuery } from '../../interfaces/event/GetAllEventsUsecase.interface';
import { DEFAULT_NEWS_PAGE_SIZE } from '../../interfaces/news/GetAllNewsUsecase.interface';

class GetAllEventsUsecase implements GetAllEventsUsecaseInterface {
    constructor(private readonly domainHttpAdapter: HttpAdapterInterface) {}

    async execute(filters: GetEventsQuery): Promise<EventObject[] | Error> {
        try {
            const queryParams = new URLSearchParams();
            if (filters.languageCodes) {
                filters.languageCodes.forEach((languageCode) => {
                    queryParams.append('languageCodes', languageCode);
                });
            }

            if (filters.types) {
                filters.types.forEach((type) => {
                    queryParams.append('types', type);
                });
            }

            if (filters.page) {
                queryParams.append('page', filters.page.toString());
            }

            if (filters.title) {
                queryParams.append('title', filters.title);
            }

            queryParams.append('limit', filters.limit ? filters.limit.toString() : DEFAULT_NEWS_PAGE_SIZE.toString());

            const httpResponse: HttpResponse<CollectionCommand<EventCommand>> = await this.domainHttpAdapter.get(
                `/events?${queryParams.toString()}`
            );

            if (!httpResponse.parsedBody) {
                return new Error('errors.global');
            }

            return httpResponse.parsedBody.items.map(eventCommandToDomain);
        } catch (error: any) {
            return new Error('errors.global');
        }
    }
}

export default GetAllEventsUsecase;
