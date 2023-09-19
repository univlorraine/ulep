import Language from '../entities/Language';

interface AskForLearningLanguageUsecaseInterface {
    execute(profileId: string, language: Language, level: CEFR): Promise<Language | Error>;
}
export default AskForLearningLanguageUsecaseInterface;
