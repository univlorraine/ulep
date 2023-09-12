import Tandem from '../domain/entities/Tandem';
import LanguageCommand, { languageCommandToDomain } from './LanguageCommand';
import ProfileCommand, { profileCommandToDomain } from './ProfileCommand';

interface TandemCommand {
    id: string;
    language: LanguageCommand;
    status: TandemStatus;
    partner?: ProfileCommand;
}

export const tandemCommandToDomain = (command: TandemCommand[]) => {
    return command.map(
        (tandem) =>
            new Tandem(
                tandem.id,
                languageCommandToDomain(tandem.language),
                tandem.status,
                tandem.partner ? profileCommandToDomain(tandem.partner) : undefined
            )
    );
};

export default TandemCommand;
