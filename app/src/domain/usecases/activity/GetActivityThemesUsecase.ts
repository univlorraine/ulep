import { HttpResponse } from '../../../adapter/BaseHttpAdapter';
import { HttpAdapterInterface } from '../../../adapter/DomainHttpAdapter';
import { ActivityThemeCategoryCommand, activityThemeCategoryCommandToDomain } from '../../../command/ActivityCommand';
import { CollectionCommand } from '../../../command/CollectionCommand';
import { ActivityThemeCategory } from '../../entities/Activity';
import GetActivityThemesUsecaseInterface from '../../interfaces/activity/GetActivityThemesUsecase.interface';

class GetActivityThemesUsecase implements GetActivityThemesUsecaseInterface {
    constructor(private readonly domainHttpAdapter: HttpAdapterInterface) {}

    async execute(): Promise<ActivityThemeCategory[] | Error> {
        try {
            const httpResponse: HttpResponse<CollectionCommand<ActivityThemeCategoryCommand>> =
                await this.domainHttpAdapter.get(`/activities/categories`);

            if (!httpResponse.parsedBody || !httpResponse.parsedBody.items) {
                return new Error('errors.global');
            }

            return httpResponse.parsedBody.items.map((activityThemeCategoryCommand) =>
                activityThemeCategoryCommandToDomain(activityThemeCategoryCommand)
            );
        } catch (error: any) {
            return new Error('errors.global');
        }
    }
}

export default GetActivityThemesUsecase;
