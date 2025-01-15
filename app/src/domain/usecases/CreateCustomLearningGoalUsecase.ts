import { HttpResponse } from '../../adapter/BaseHttpAdapter';
import { HttpAdapterInterface } from '../../adapter/DomainHttpAdapter';
import CustomLearningGoalCommand, { customLearningGoalCommandToDomain } from '../../command/CustomLearningGoalCommand';
import CustomLearningGoal from '../entities/CustomLearningGoal';
import CreateCustomLearningGoalUsecaseInterface, { CreateCustomLearningGoalCommand } from '../interfaces/CreateCustomLearningGoal.interface';

class CreateCustomLearningGoalUsecase implements CreateCustomLearningGoalUsecaseInterface {
    constructor(private readonly domainHttpAdapter: HttpAdapterInterface) {}

    async execute(command: CreateCustomLearningGoalCommand): Promise<CustomLearningGoal[] | Error> {
        try {
            const httpResponse: HttpResponse<CustomLearningGoalCommand[]> = await this.domainHttpAdapter.post(
                '/objectives/custom-learning-goals/',
                {
                    title: command.title,
                    description: command.description,
                    learningLanguageId: command.learningLanguageId,
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

export default CreateCustomLearningGoalUsecase;
