import Language from '../domain/entities/Language';

interface LanguageCommand {
    enabled: boolean;
    code: string;
    name: string;
}

export const languageCommandToDomain = (command: LanguageCommand) => {
    return new Language(command.code, command.name, command.enabled);
};

export default LanguageCommand;
