import Person from "../entities/Person";

interface RetrievePersonInfoUsecaseInterface {
    execute(tokenKeycloak:string): Promise<Person | Error>;
}
export default RetrievePersonInfoUsecaseInterface;