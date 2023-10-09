import { HttpResponse } from '../../adapter/BaseHttpAdapter';
import { HttpAdapterInterface } from '../../adapter/DomainHttpAdapter';
import CentralStudentCommand, { centralStudentCommandToDomain } from '../../command/CentralStudentCommand';
import CentralStudent from '../entities/CentralStudent';
import RetrievePersonInfoUsecaseInterface from '../interfaces/RetrievePersonInfoUsecase.interface';

class RetrievePersonInfoUsecase implements RetrievePersonInfoUsecaseInterface {
    constructor(private readonly domainHttpAdapter: HttpAdapterInterface) {}

    async execute(tokenKeycloak: string): Promise<CentralStudent | Error> {
        const requestBody = {
            tokenKeycloak: tokenKeycloak,
        };
        try {
            const httpResponse: HttpResponse<CentralStudentCommand> = await this.domainHttpAdapter.post(
                `/userUniversityInfos`,
                requestBody,
                undefined,
                'application/json',
                false
            );
            if (!httpResponse.parsedBody) {
                return new Error('errors.gateway');
            }
            return centralStudentCommandToDomain(httpResponse.parsedBody);
        } catch (error: any) {
            return new Error('errors.gateway');
        }
    }
}
export default RetrievePersonInfoUsecase;
