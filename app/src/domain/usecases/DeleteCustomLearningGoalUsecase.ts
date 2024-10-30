

import { HttpResponse } from '../../adapter/BaseHttpAdapter';
import { HttpAdapterInterface } from '../../adapter/DomainHttpAdapter';
import CustomLearningGoalCommand, { customLearningGoalCommandToDomain } from '../../command/CustomLearningGoalCommand';
import CustomLearningGoal from '../entities/CustomLearningGoal';
import DeleteCustomLearningGoalUsecaseInterface, { DeleteCustomLearningGoalCommand } from '../interfaces/DeleteCustomLearningGoalUsecae.interface';

class DeleteCustomLearningGoalUsecase implements DeleteCustomLearningGoalUsecaseInterface {
    constructor(private readonly domainHttpAdapter: HttpAdapterInterface) {}

    async execute(command: DeleteCustomLearningGoalCommand): Promise<CustomLearningGoal[] | Error> {
        try {
            const httpResponse: HttpResponse<CustomLearningGoalCommand[]> = await this.domainHttpAdapter.delete(
                `/objectives/custom-learning-goals/${command.id}`,
            );

            if (!httpResponse.parsedBody) {
                return new Error('errors.global');
            }

            return httpResponse.parsedBody.map(customLearningGoalCommandToDomain);
        } catch (error: any) {
            return new Error('errors.global');
        }
    }
}

export default DeleteCustomLearningGoalUsecase;
