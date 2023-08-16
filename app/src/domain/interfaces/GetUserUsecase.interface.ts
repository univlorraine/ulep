import User from '../entities/User';

interface GetUserUsecaseInterface {
    execute(): Promise<User | Error>;
}
export default GetUserUsecaseInterface;
