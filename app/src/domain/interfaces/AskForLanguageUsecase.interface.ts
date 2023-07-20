import Language from '../entities/Language';

interface AskForLanguageUsecaseUsecaseInterface {
    execute(language: Language): Promise<number | Error>;
}
export default AskForLanguageUsecaseUsecaseInterface;
