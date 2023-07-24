import Language from '../entities/Language';

interface AskForLanguageUsecaseInterface {
    execute(language: Language): Promise<number | Error>;
}
export default AskForLanguageUsecaseInterface;
