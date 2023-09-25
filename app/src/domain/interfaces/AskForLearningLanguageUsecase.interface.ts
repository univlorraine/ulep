import Language from '../entities/Language';

interface AskForLearningLanguageUsecaseInterface {
    execute(
        profileId: string,
        language: Language,
        level: CEFR,
        learningType: Pedagogy,
        sameAge: boolean,
        sameGender: boolean,
        campusId?: string,
        isForCertificate?: boolean,
        isForProgram?: boolean
    ): Promise<Language | Error>;
}
export default AskForLearningLanguageUsecaseInterface;
