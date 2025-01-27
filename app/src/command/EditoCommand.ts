import Edito from '../domain/entities/Edito';
import UniversityCommand, { universityCommandToDomain } from './UniversityCommand';

interface EditoCommand {
    id: string;
    content: string;
    university: UniversityCommand;
    imageURL?: string;
}

export const editoCommandToDomain = (command: EditoCommand) => {
    return new Edito(command.id, command.content, universityCommandToDomain(command.university), command.imageURL);
};

export default EditoCommand;
