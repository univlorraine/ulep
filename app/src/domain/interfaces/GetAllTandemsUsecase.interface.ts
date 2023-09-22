import Tandem from '../entities/Tandem';

interface GetAllTandemsUsecaseInterface {
    execute(id: string): Promise<Tandem[] | Error>;
}
export default GetAllTandemsUsecaseInterface;
