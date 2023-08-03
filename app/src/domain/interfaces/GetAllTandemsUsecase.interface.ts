import Tandem from '../entities/Tandem';

interface GetAllTandemsUsecaseInterface {
    execute(): Promise<Tandem[] | Error>;
}
export default GetAllTandemsUsecaseInterface;
