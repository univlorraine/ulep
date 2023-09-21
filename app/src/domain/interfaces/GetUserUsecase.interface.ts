import User from '../entities/User';

interface GetUserUsecaseInterface {
    execute(accessToken: string): Promise<User | Error>;
}
export default GetUserUsecaseInterface;
