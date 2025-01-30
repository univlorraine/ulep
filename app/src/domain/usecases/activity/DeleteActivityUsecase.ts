import { HttpResponse } from '../../../adapter/BaseHttpAdapter';
import { HttpAdapterInterface } from '../../../adapter/DomainHttpAdapter';
import { ActivityCommand } from '../../../command/ActivityCommand';
import DeleteActivityUsecaseInterface from '../../interfaces/activity/DeleteActivityUsecase.interface';

class DeleteActivityUsecase implements DeleteActivityUsecaseInterface {
    constructor(private readonly domainHttpAdapter: HttpAdapterInterface) {}

    async execute(id: string): Promise<void | Error> {
        try {
            const httpResponse: HttpResponse<ActivityCommand> = await this.domainHttpAdapter.delete(
                `/activities/${id}`
            );

            if (!httpResponse.parsedBody) {
                return new Error('errors.global');
            }
        } catch (error: any) {
            return new Error('errors.global');
        }
    }
}

export default DeleteActivityUsecase;
