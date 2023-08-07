import { HttpResponse } from '../../adapter/BaseHttpAdapter';
import { HttpAdapterInterface } from '../../adapter/DomainHttpAdapter';
import CategoryInterestsCommand, { categoryInterestsCommandToDomain } from '../../command/CategoryInterestsCommand';
import CategoryInterests from '../entities/CategoryInterests';
import GetAllInterestCategoriessUsecaseInterface from '../interfaces/GetAllInterestCategoriessUsecase.interface';

class GetAllInterestCategoriessUsecase implements GetAllInterestCategoriessUsecaseInterface {
    constructor(private readonly domainHttpAdapter: HttpAdapterInterface) {}

    async execute(): Promise<CategoryInterests[] | Error> {
        try {
            const httpResponse: HttpResponse<CategoryInterestsCommand[]> = await this.domainHttpAdapter.get(
                `/interests/categories`
            );

            if (!httpResponse.parsedBody) {
                return new Error('errors.global');
            }

            return httpResponse.parsedBody.map((category) => categoryInterestsCommandToDomain(category));
        } catch (error: any) {
            return new Error('errors.global');
        }
    }
}

export default GetAllInterestCategoriessUsecase;
