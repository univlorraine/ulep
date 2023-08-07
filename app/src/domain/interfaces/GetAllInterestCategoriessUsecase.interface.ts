import CategoryInterests from '../entities/CategoryInterests';

interface GetAllInterestCategoriessUsecaseInterface {
    execute(): Promise<CategoryInterests[] | Error>;
}
export default GetAllInterestCategoriessUsecaseInterface;
