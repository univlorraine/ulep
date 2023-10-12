import CentralStudent from '../entities/CentralStudent';

interface RetrievePersonInfoUsecaseInterface {
    execute(): Promise<CentralStudent | Error>;
}
export default RetrievePersonInfoUsecaseInterface;
