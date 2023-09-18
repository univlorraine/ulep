import Language from '../domain/entities/Language';
import Tandem from '../domain/entities/Tandem';
import LearningLanguageCommand from './LearningLanguageCommand';
import { profileCommandToDomain } from './ProfileCommand';

interface TandemCommand {
    id: string;
    status: TandemStatus;
    partnerLearningLanguage: LearningLanguageCommand;
}

export const tandemCommandToDomain = (command: TandemCommand[]) => {
    return command.map(
        (tandem) =>
            new Tandem(
                tandem.id,
                tandem.status,
                new Language(
                    tandem.partnerLearningLanguage.id,
                    tandem.partnerLearningLanguage.code,
                    tandem.partnerLearningLanguage.name
                ),
                tandem.partnerLearningLanguage.level as CEFR,
                profileCommandToDomain(tandem.partnerLearningLanguage.profile)
            )
    );
};

export default TandemCommand;
