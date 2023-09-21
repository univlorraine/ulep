import Profile from '../entities/Profile';

interface GetProfileUsecaseInterface {
    execute(accessToken: string): Promise<Profile | Error>;
}
export default GetProfileUsecaseInterface;
