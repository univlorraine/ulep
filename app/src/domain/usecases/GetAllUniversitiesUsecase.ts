import { HttpResponse } from '../../adapter/BaseHttpAdapter';
import { HttpAdapterInterface } from '../../adapter/DomainHttpAdapter';
import { CollectionCommand } from '../../command/CollectionCommand';
import UniversityCommand, { universityCommandToDomain } from '../../command/UniversityCommand';
import University from '../entities/University';
import GetAllUniversitiesUsecaseInterface from '../interfaces/GetAllUniversitiesUsecase.interface';

class GetAllUniversitiesUsecase implements GetAllUniversitiesUsecaseInterface {
    constructor(private readonly domainHttpAdapter: HttpAdapterInterface) {}

    async execute(): Promise<University[] | Error> {
        try {
            const httpRepsonse: HttpResponse<CollectionCommand<UniversityCommand>> = await this.domainHttpAdapter.get(
                `/universities`
            );

            console.log(httpRepsonse.parsedBody);

            if (!httpRepsonse.parsedBody || !httpRepsonse.parsedBody.items) {
                return new Error('errors.global');
            }

            return httpRepsonse.parsedBody.items.map((university) => universityCommandToDomain(university));
        } catch (error: any) {
            return new Error('errors.global');
        }
    }
}

export default GetAllUniversitiesUsecase;
