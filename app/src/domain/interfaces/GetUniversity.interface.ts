import University from '../entities/University';

interface GetUniversityInterface {
    execute(universityId: string): Promise<University | Error>;
}
export default GetUniversityInterface;
