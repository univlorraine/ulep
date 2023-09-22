import Person from "../domain/entities/Person";

interface PersonCommand {
    email: string;
    firstname: string;
    lastname: string;
    age: number;
    gender: string;
    role: string;
    diploma: {
        code: string,
        label: string
    };
    departement: {
        code: string,
        label: string
    };
}
export const personCommandToDomain = (command: PersonCommand) => {
    return new Person(
        command.email,
        command.firstname,
        command.lastname,
        command.age,
        command.gender,
        command.role,
        command.diploma,
        command.departement
    );
};
export default PersonCommand