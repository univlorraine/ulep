import University from '../entities/University';

interface GetAllUniversitiesUsecaseInterface {
    execute(): Promise<University[] | Error>;
}
export default GetAllUniversitiesUsecaseInterface;
