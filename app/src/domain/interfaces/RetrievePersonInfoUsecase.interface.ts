import Person from "../entities/Person";

interface RetrievePersonInfoUsecaseInterface {
    execute(login:string): Promise<Person | Error>;
}
export default RetrievePersonInfoUsecaseInterface;