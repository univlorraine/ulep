import Language from '../entities/Language';

interface CreateOrUpdateTestedLanguageUsecaseInterface {
    execute: (id: string, language: Language, level: CEFR) => Promise<void | Error>;
}

export default CreateOrUpdateTestedLanguageUsecaseInterface;
