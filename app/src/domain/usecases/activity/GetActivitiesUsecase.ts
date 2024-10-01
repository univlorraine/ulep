import { HttpResponse } from '../../../adapter/BaseHttpAdapter';
import { HttpAdapterInterface } from '../../../adapter/DomainHttpAdapter';
import { ActivityCommand, activityCommandToDomain } from '../../../command/ActivityCommand';
import { CollectionCommand } from '../../../command/CollectionCommand';
import { Activity } from '../../entities/Activity';
import GetActivitiesUsecaseInterface, {
    GetActivitiesFilters,
} from '../../interfaces/activity/GetActivitiesUsecase.interface';

class GetActivitiesUsecase implements GetActivitiesUsecaseInterface {
    constructor(private readonly domainHttpAdapter: HttpAdapterInterface) {}

    async execute(filters: GetActivitiesFilters): Promise<Activity[] | Error> {
        try {
            const queryParams = new URLSearchParams();
            if (filters.language) {
                filters.language.forEach((language) => {
                    queryParams.append('languagesCodes', language.code);
                });
            }
            if (filters.proficiency) {
                filters.proficiency.forEach((proficiency) => {
                    queryParams.append('languageLevels', proficiency);
                });
            }
            if (filters.activityTheme) {
                filters.activityTheme.forEach((activityTheme) => {
                    queryParams.append('themesIds', activityTheme.id);
                });
            }
            if (filters.isMe) {
                queryParams.append('shouldTakeOnlyMine', filters.isMe as unknown as string);
            }

            if (filters.page) {
                queryParams.append('page', filters.page.toString());
            }

            if (filters.searchTitle) {
                queryParams.append('searchTitle', filters.searchTitle);
            }

            const httpResponse: HttpResponse<CollectionCommand<ActivityCommand>> = await this.domainHttpAdapter.get(
                `/activities?${queryParams.toString()}`
            );

            if (!httpResponse.parsedBody) {
                return new Error('errors.global');
            }

            return httpResponse.parsedBody.items.map(activityCommandToDomain);
        } catch (error: any) {
            return new Error('errors.global');
        }
    }
}

export default GetActivitiesUsecase;
