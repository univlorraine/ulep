import Language from '../entities/Language';

interface GetAllLanguagesUsecaseInterface {
    execute(): Promise<Language[] | Error>;
}
export default GetAllLanguagesUsecaseInterface;
