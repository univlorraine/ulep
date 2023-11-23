import { HttpResponse } from '../../adapter/BaseHttpAdapter';
import { HttpAdapterInterface } from '../../adapter/DomainHttpAdapter';
import UniversityCommand, { universityCommandToDomain } from '../../command/UniversityCommand';
import University from '../entities/University';
import GetUniversityInterface from '../interfaces/GetUniversity.interface';

class GetUniversityUsecase implements GetUniversityInterface {
    constructor(private readonly domainHttpAdapter: HttpAdapterInterface) {}
    async execute(universityId: string): Promise<University | Error> {
        try {
            const httpResponse: HttpResponse<UniversityCommand> = await this.domainHttpAdapter.get(
                `/universities/${universityId}`
            );

            if (!httpResponse.parsedBody) {
                return new Error('errors.global');
            }

            return universityCommandToDomain(httpResponse.parsedBody);
        } catch (error: any) {
            return new Error('errors.global');
        }
    }
}

export default GetUniversityUsecase;
