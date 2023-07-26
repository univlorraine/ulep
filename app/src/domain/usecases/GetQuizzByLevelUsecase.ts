import { HttpResponse } from '../../adapter/BaseHttpAdapter';
import { HttpAdapterInterface } from '../../adapter/DomainHttpAdapter';
import QuestionCommand, { quizzCommandToDomain } from '../../command/QuestionCommand';
import Question from '../entities/Question';
import cefr from '../entities/cefr';
import GetQuizzByLevelUsecaseInterface from '../interfaces/GetQuizzByLevelUsecase.interface';

class GetQuizzByLevelUsecase implements GetQuizzByLevelUsecaseInterface {
    constructor(private readonly domainHttpAdapter: HttpAdapterInterface) {}
    async execute(level: cefr): Promise<Question[] | Error> {
        try {
            const httpRepsonse: HttpResponse<QuestionCommand[]> = await this.domainHttpAdapter.get(
                `/cefr/questions/${level}`
            );

            if (!httpRepsonse.parsedBody) {
                return new Error('errors.global');
            }

            return quizzCommandToDomain(httpRepsonse.parsedBody);
        } catch (error: any) {
            return new Error('errors.global');
        }
    }
}

export default GetQuizzByLevelUsecase;
