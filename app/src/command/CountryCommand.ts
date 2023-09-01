import Country from '../domain/entities/Country';
import UniversityCommand, { universityCommandToDomain } from './UniversityCommand';

interface CountryCommand {
    id: string;
    code: string;
    emoji: string;
    name: string;
    universities: UniversityCommand[];
}

export const countryCommandToDomain = (command: CountryCommand) => {
    return new Country(
        command.id,
        command.code,
        command.name,
        command.emoji,
        command.universities.map((university) => universityCommandToDomain(university))
    );
};

export default CountryCommand;
