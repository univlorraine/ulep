import Country from '../domain/entities/Country';

interface CountryCommand {
    id: string;
    code: string;
    name: string;
}

export const countryCommandToDomain = (command: CountryCommand) => {
    return new Country(command.id, command.code, command.name);
};

export default CountryCommand;
