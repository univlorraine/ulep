import Language from '../domain/entities/Language';

interface LanguageCommand {
    code: string;
    name: string;
}

export interface LanguageAskedCommand {
    code: string;
    count: number;
}

export const languageCommandToDomain = (command: LanguageCommand) => {
    return new Language(command.code, command.name);
};

export default LanguageCommand;
