import { HttpResponse } from '../../../adapter/BaseHttpAdapter';
import { HttpAdapterInterface } from '../../../adapter/DomainHttpAdapter';
import { CollectionCommand } from '../../../command/CollectionCommand';
import { NewsCommand, newsCommandToDomain } from '../../../command/NewsCommand';
import News from '../../entities/News';
import GetAllNewsUsecaseInterface, {
    DEFAULT_NEWS_PAGE_SIZE,
    GetNewsQuery,
} from '../../interfaces/news/GetAllNewsUsecase.interface';

class GetAllNewsUsecase implements GetAllNewsUsecaseInterface {
    constructor(private readonly domainHttpAdapter: HttpAdapterInterface) {}

    async execute(filters: GetNewsQuery): Promise<News[] | Error> {
        try {
            const queryParams = new URLSearchParams();
            if (filters.languageCode) {
                queryParams.append('languageCode', filters.languageCode);
            }

            if (filters.universityIds) {
                filters.universityIds.forEach((universityId) => {
                    queryParams.append('universityIds', universityId);
                });
            }

            if (filters.page) {
                queryParams.append('page', filters.page.toString());
            }

            if (filters.title) {
                queryParams.append('title', filters.title);
            }

            queryParams.append('limit', filters.limit ? filters.limit.toString() : DEFAULT_NEWS_PAGE_SIZE.toString());

            const httpResponse: HttpResponse<CollectionCommand<NewsCommand>> = await this.domainHttpAdapter.get(
                `/news?${queryParams.toString()}`
            );

            if (!httpResponse.parsedBody) {
                return new Error('errors.global');
            }

            return httpResponse.parsedBody.items.map(newsCommandToDomain);
        } catch (error: any) {
            return new Error('errors.global');
        }
    }
}

export default GetAllNewsUsecase;
