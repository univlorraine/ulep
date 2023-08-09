import Country from '../domain/entities/Country';

interface CountryCommand {
    id: string;
    code: string;
    emoji: string;
    name: string;
}

export const countryCommandToDomain = (command: CountryCommand) => {
    return new Country(command.id, command.code, command.name, command.emoji);
};

export default CountryCommand;
