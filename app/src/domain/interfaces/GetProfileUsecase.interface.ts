import Profile from '../entities/Profile';

interface GetProfileUsecaseInterface {
    execute(): Promise<Profile | Error>;
}
export default GetProfileUsecaseInterface;
