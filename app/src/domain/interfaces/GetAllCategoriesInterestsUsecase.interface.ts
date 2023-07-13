import CategoryInterests from '../entities/CategoryInterests';

interface GetAllCategoriesInterestUsecaseInterface {
    execute(): Promise<CategoryInterests[] | Error>;
}
export default GetAllCategoriesInterestUsecaseInterface;
