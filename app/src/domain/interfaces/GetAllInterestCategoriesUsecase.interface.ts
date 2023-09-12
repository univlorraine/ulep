import CategoryInterests from '../entities/CategoryInterests';

interface GetAllInterestCategoriesUsecaseInterface {
    execute(): Promise<CategoryInterests[] | Error>;
}
export default GetAllInterestCategoriesUsecaseInterface;
