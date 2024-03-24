import Language from '../entities/Language';
import LearningLanguage from '../entities/LearningLanguage';

interface AskForLearningLanguageUsecaseInterface {
    execute(
        profileId: string,
        language: Language,
        level: CEFR,
        learningType: Pedagogy,
        sameAge: boolean,
        sameGender: boolean,
        sameTandem: boolean,
        campusId?: string,
        isForCertificate?: boolean,
        isForProgram?: boolean,
    ): Promise<LearningLanguage | Error>;
}
export default AskForLearningLanguageUsecaseInterface;
