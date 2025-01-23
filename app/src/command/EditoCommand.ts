import Edito from '../domain/entities/Edito';
import UniversityCommand, { universityCommandToDomain } from './UniversityCommand';

interface EditoCommand {
    id: string;
    title: string;
    description: string;
    university: UniversityCommand;
    image?: { id: string; mimeType: string };
}

export const editoCommandToDomain = (command: EditoCommand) => {
    return new Edito(
        command.id,
        command.title,
        command.description,
        universityCommandToDomain(command.university),
        command.image?.id
    );
};

export default EditoCommand;
