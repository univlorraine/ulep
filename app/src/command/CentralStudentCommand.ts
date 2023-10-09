import CentralStudent from '../domain/entities/CentralStudent';

interface CentralStudentCommand {
    email: string;
    firstname: string;
    lastname: string;
    age: number;
    gender: string;
    role: string;
    diploma: string;
    departement: string;
}
export const centralStudentCommandToDomain = (command: CentralStudentCommand) => {
    return new CentralStudent(
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
export default CentralStudentCommand;
