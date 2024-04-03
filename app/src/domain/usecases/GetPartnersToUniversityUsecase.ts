import { HttpResponse } from '../../adapter/BaseHttpAdapter';
import { HttpAdapterInterface } from '../../adapter/DomainHttpAdapter';
import UniversityCommand, { universityCommandToDomain } from '../../command/UniversityCommand';
import University from '../entities/University';
import GetPartnersToUniversityUsecaseInterface from '../interfaces/GetPartnersToUniversityUsecase.interface';

class GetPartnersToUniversityUsecase implements GetPartnersToUniversityUsecaseInterface {
    constructor(private readonly domainHttpAdapter: HttpAdapterInterface) {}
    async execute(universityId: string): Promise<University[] | Error> {
        try {
            const httpResponse: HttpResponse<UniversityCommand[]> = await this.domainHttpAdapter.get(
                `/universities/${universityId}/partners`
            );

            if (!httpResponse.parsedBody) {
                return new Error('errors.global');
            }
            return httpResponse.parsedBody.map(universityCommandToDomain);
        } catch (error: any) {
            return new Error('errors.global');
        }
    }
}

export default GetPartnersToUniversityUsecase;
