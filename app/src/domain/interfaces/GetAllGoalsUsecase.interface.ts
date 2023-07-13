import Goal from '../entities/Goal';

interface GetAllGoalsUsecaseInterface {
    execute(): Promise<Goal[] | Error>;
}
export default GetAllGoalsUsecaseInterface;
