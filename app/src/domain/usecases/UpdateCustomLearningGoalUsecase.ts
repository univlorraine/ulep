

import { HttpResponse } from '../../adapter/BaseHttpAdapter';
import { HttpAdapterInterface } from '../../adapter/DomainHttpAdapter';
import CustomLearningGoalCommand, { customLearningGoalCommandToDomain } from '../../command/CustomLearningGoalCommand';
import CustomLearningGoal from '../entities/CustomLearningGoal';
import UpdateCustomLearningGoalUsecaseInterface, { UpdateCustomLearningGoalCommand } from '../interfaces/UpdateCustomLearningGoal.interface';

class UpdateCustomLearningGoalUsecase implements UpdateCustomLearningGoalUsecaseInterface {
    constructor(private readonly domainHttpAdapter: HttpAdapterInterface) {}

    async execute(command: UpdateCustomLearningGoalCommand): Promise<CustomLearningGoal[] | Error> {
        try {
            const httpResponse: HttpResponse<CustomLearningGoalCommand[]> = await this.domainHttpAdapter.put(
                `/objectives/custom-learning-goals/${command.id}`,
                {
                    title: command.title,
                    description: command.description,
                },
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

export default UpdateCustomLearningGoalUsecase;
