import LearningLanguage from '../domain/entities/LearningLanguage';
import ProfileCommand, { profileCommandToDomain } from './ProfileCommand';

interface LearningLanguageCommand {
    id: string;
    name: string;
    code: string;
    level: CEFR;
    profile: ProfileCommand;
}

export const learningLanguageCommandToDomain = (command: LearningLanguageCommand) => {
    return new LearningLanguage(
        command.id,
        command.code,
        command.name,
        command.level,
        profileCommandToDomain(command.profile)
    );
};

export default LearningLanguageCommand;
