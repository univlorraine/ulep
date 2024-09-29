import { HttpResponse } from '../../../adapter/BaseHttpAdapter';
import { HttpAdapterInterface } from '../../../adapter/DomainHttpAdapter';
import { ActivityCommand, activityCommandToDomain } from '../../../command/ActivityCommand';
import { Activity } from '../../entities/Activity';
import GetActivityUsecaseInterface from '../../interfaces/activity/GetActivityUsecase.interface';

class GetActivityUsecase implements GetActivityUsecaseInterface {
    constructor(private readonly domainHttpAdapter: HttpAdapterInterface) {}

    async execute(activityId: string): Promise<Activity | Error> {
        try {
            const httpResponse: HttpResponse<ActivityCommand> = await this.domainHttpAdapter.get(
                `/activity/${activityId}`
            );

            if (!httpResponse.parsedBody) {
                return new Error('errors.global');
            }

            return activityCommandToDomain(httpResponse.parsedBody);
        } catch (error: any) {
            return new Error('errors.global');
        }
    }
}

export default GetActivityUsecase;
