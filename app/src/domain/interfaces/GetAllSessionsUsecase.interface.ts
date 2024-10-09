import Session from '../entities/Session';

interface GetAllSessionsUsecaseInterface {
    execute(id: string): Promise<Session[] | Error>;
}
export default GetAllSessionsUsecaseInterface;
