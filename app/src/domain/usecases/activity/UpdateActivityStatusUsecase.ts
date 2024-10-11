import { HttpResponse } from '../../../adapter/BaseHttpAdapter';
import { HttpAdapterInterface } from '../../../adapter/DomainHttpAdapter';
import { ActivityStatus } from '../../entities/Activity';
import UpdateActivityStatusUsecaseInterface from '../../interfaces/activity/UpdateActivityStatusUsecase.interface';

class UpdateActivityStatusUsecase implements UpdateActivityStatusUsecaseInterface {
    constructor(private readonly domainHttpAdapter: HttpAdapterInterface) {}

    async execute(id: string, status: ActivityStatus): Promise<void | Error> {
        try {

            const httpResponse: HttpResponse<void> = await this.domainHttpAdapter.put(
                `/activities/${id}/update`,
                { status }
            );

            if (!httpResponse.parsedBody) {
                return new Error('errors.global');
            }

            return;
        } catch (error: any) {
            return new Error('errors.global');
        }
    }
}

export default UpdateActivityStatusUsecase;
