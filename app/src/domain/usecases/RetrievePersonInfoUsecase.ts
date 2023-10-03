import { HttpResponse } from "../../adapter/BaseHttpAdapter";
import { HttpAdapterInterface } from "../../adapter/DomainHttpAdapter";
import PersonCommand, { personCommandToDomain } from "../../command/PersonCommand";
import Person from "../entities/Person";
import RetrievePersonInfoUsecaseInterface from "../interfaces/RetrievePersonInfoUsecase.interface";

class RetrievePersonInfoUsecase implements RetrievePersonInfoUsecaseInterface {
    constructor(private readonly domainHttpAdapter: HttpAdapterInterface){}
    
    

    async execute(tokenKeycloak:string): Promise<Person | Error> {
        const requestBody = {
            "tokenKeycloak":tokenKeycloak
        }
        try {
            const httpResponse: HttpResponse<PersonCommand> = await this.domainHttpAdapter.post(
                `/userUniversityInfos`,
                requestBody,
                undefined,
                'application/json',
                false
            );
            if (!httpResponse.parsedBody) {
                return new Error('errors.gateway');
            }
            return personCommandToDomain(httpResponse.parsedBody);
        } catch (error:any) {
            return new Error('errors.gateway');
        }
    }
}
export default RetrievePersonInfoUsecase;