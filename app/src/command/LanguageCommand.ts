import Language from '../domain/entities/Language';

interface LanguageCommand {
    id: string;
    enabled: boolean;
    code: string;
    name: string;
}

export const languageCommandToDomain = (command: LanguageCommand) => {
    return new Language(command.id, command.code, command.name, command.enabled);
};

export default LanguageCommand;
