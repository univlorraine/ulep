import Language from '../entities/Language';

interface GetAllLanguagesUsecaseInterface {
    execute(universityId?: string): Promise<Language[] | Error>;
}
export default GetAllLanguagesUsecaseInterface;
