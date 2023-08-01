import Tandem from '../domain/entities/Tandem';
import LanguageCommand, { languageCommandToDomain } from './LanguageCommand';
import ProfileCommand, { profileCommandToDomain } from './ProfileCommand';

interface TandemCommand {
    id: string;
    profiles: ProfileCommand[];
    language: LanguageCommand;
    status: TandemStatus;
}

export const tandemCommandToDomain = (command: TandemCommand[]) => {
    return command.map(
        (tandem) =>
            new Tandem(
                tandem.id,
                tandem.profiles.map((profile) => profileCommandToDomain(profile)),
                languageCommandToDomain(tandem.language),
                tandem.status
            )
    );
};

export default TandemCommand;
