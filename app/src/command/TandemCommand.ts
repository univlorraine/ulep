import Language from '../domain/entities/Language';
import Tandem from '../domain/entities/Tandem';
import LearningLanguageCommand from './LearningLanguageCommand';
import { profileCommandToDomain } from './ProfileCommand';

interface TandemCommand {
    id: string;
    status: TandemStatus;
    partnerLearningLanguage: LearningLanguageCommand;
    userLearningLanguage: Omit<LearningLanguageCommand, 'profile'>;
}

export const tandemCommandToDomain = (command: TandemCommand[]) => {
    return command.map(
        (tandem) =>
            new Tandem(
                tandem.id,
                tandem.status,
                new Language(
                    tandem.userLearningLanguage.id,
                    tandem.userLearningLanguage.code,
                    tandem.userLearningLanguage.name
                ),
                new Language(tandem.partnerLearningLanguage.id, tandem.partnerLearningLanguage.code, tandem.partnerLearningLanguage.name),
                tandem.partnerLearningLanguage.level as CEFR,
                tandem.partnerLearningLanguage.learningType as Pedagogy,
                profileCommandToDomain(tandem.partnerLearningLanguage.profile)
            )
    );
};

export default TandemCommand;
