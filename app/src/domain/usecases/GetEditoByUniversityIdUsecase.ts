import { HttpResponse } from '../../adapter/BaseHttpAdapter';
import { HttpAdapterInterface } from '../../adapter/DomainHttpAdapter';
import EditoCommand, { editoCommandToDomain } from '../../command/EditoCommand';
import Edito from '../entities/Edito';
import GetEditoByUniversityIdUsecaseInterface from '../interfaces/GetEditoByUniversityIdUsecase.interface';

class GetEditoByUniversityIdUsecase implements GetEditoByUniversityIdUsecaseInterface {
    constructor(private readonly domainHttpAdapter: HttpAdapterInterface) {}

    async execute(universityId: string): Promise<Edito | Error> {
        try {
            const httpResponse: HttpResponse<EditoCommand> = await this.domainHttpAdapter.get(
                `/editos/university/${universityId}`,
                {},
                false
            );

            if (!httpResponse.parsedBody) {
                return new Error('errors.global');
            }

            return editoCommandToDomain(httpResponse.parsedBody);
        } catch (error: any) {
            return new Error('errors.global');
        }
    }
}

export default GetEditoByUniversityIdUsecase;
