import { HttpResponse } from '../../../adapter/BaseHttpAdapter';
import { HttpAdapterInterface } from '../../../adapter/DomainHttpAdapter';
import { ActivityThemeCategoryCommand, activityThemeCategoryCommandToDomain } from '../../../command/ActivityCommand';
import { ActivityThemeCategory } from '../../entities/Activity';
import GetActivityThemesUsecaseInterface from '../../interfaces/activity/GetActivityThemesUsecase.interface';

class GetActivityThemesUsecase implements GetActivityThemesUsecaseInterface {
    constructor(private readonly domainHttpAdapter: HttpAdapterInterface) {}

    async execute(): Promise<ActivityThemeCategory[] | Error> {
        try {
            const httpResponse: HttpResponse<ActivityThemeCategoryCommand[]> = await this.domainHttpAdapter.get(
                `/activity/category`
            );

            if (!httpResponse.parsedBody) {
                return new Error('errors.global');
            }

            return httpResponse.parsedBody.map((activityThemeCategoryCommand) =>
                activityThemeCategoryCommandToDomain(activityThemeCategoryCommand)
            );
        } catch (error: any) {
            return new Error('errors.global');
        }
    }
}

export default GetActivityThemesUsecase;
