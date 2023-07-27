import Question from '../entities/Question';

interface GetQuizzByLevelUsecaseInterface {
    execute(level: string): Promise<Question[] | Error>;
}
export default GetQuizzByLevelUsecaseInterface;
