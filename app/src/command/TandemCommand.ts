import Tandem from '../domain/entities/Tandem';
import learningLanguageResultToDomain, { LearningLanguageResult } from './LearningLanguageResult';

interface TandemCommand {
    id: string;
    status: TandemStatus;
    partnerLearningLanguage: LearningLanguageResult;
    userLearningLanguage: Omit<LearningLanguageResult, 'profile'>;
}

export const tandemCommandToDomain = (command: TandemCommand[]) => {
    return command.map(
        (tandem) => {
            const userLearningLanguage = learningLanguageResultToDomain(tandem.userLearningLanguage);
            const partnerLearningLanguage = learningLanguageResultToDomain(tandem.partnerLearningLanguage);
            return new Tandem(
                tandem.id,
                tandem.status,
                userLearningLanguage,
                partnerLearningLanguage,
                partnerLearningLanguage.level,
                partnerLearningLanguage.learningType,
                partnerLearningLanguage.profile
            )
        }
    );
};

export default TandemCommand;
