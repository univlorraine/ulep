import { HttpResponse } from "../../adapter/BaseHttpAdapter";
import { HttpAdapterInterface } from "../../adapter/DomainHttpAdapter";
import PersonCommand, { personCommandToDomain } from "../../command/PersonCommand";
import Person from "../entities/Person";
import RetrievePersonInfoUsecaseInterface from "../interfaces/RetrievePersonInfoUsecase.interface";

class RetrievePersonInfoUsecase implements RetrievePersonInfoUsecaseInterface {
    constructor(private readonly domainHttpAdapter: HttpAdapterInterface){}
    
    

    async execute(loginUL:string): Promise<Person | Error> {
        const requestBody = {
            "login":loginUL
        }
        try {
            const httpResponse: HttpResponse<PersonCommand> = await this.domainHttpAdapter.post(
                `/connecteur`,
                requestBody,
                undefined,
                'application/json',
                false
            );

            if (!httpResponse.parsedBody) {
                return new Error('errors.global');
            }
            return personCommandToDomain(httpResponse.parsedBody);
        } catch (error:any) {
            return new Error('errors.global');
        }
    }
}
export default RetrievePersonInfoUsecase;