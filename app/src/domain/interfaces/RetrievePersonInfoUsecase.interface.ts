import CentralStudent from '../entities/CentralStudent';

interface RetrievePersonInfoUsecaseInterface {
    execute(tokenKeycloak: string): Promise<CentralStudent | Error>;
}
export default RetrievePersonInfoUsecaseInterface;
