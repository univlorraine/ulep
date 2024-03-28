import Language from '../entities/Language';

interface GetUniversityLanguagesUsecaseInterface {
    execute(universityId: string): Promise<Language[] | Error>;
}
export default GetUniversityLanguagesUsecaseInterface;
