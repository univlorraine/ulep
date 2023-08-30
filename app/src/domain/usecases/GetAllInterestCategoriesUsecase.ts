import { HttpResponse } from '../../adapter/BaseHttpAdapter';
import { HttpAdapterInterface } from '../../adapter/DomainHttpAdapter';
import CategoryInterestsCommand, { categoryInterestsCommandToDomain } from '../../command/CategoryInterestsCommand';
import { CollectionCommand } from '../../command/CollectionCommand';
import CategoryInterests from '../entities/CategoryInterests';
import GetAllInterestCategoriesUsecaseInterface from '../interfaces/GetAllInterestCategoriesUsecase.interface';

class GetAllInterestCategoriesUsecase implements GetAllInterestCategoriesUsecaseInterface {
    constructor(private readonly domainHttpAdapter: HttpAdapterInterface) {}

    async execute(): Promise<CategoryInterests[] | Error> {
        try {
            const httpResponse: HttpResponse<CollectionCommand<CategoryInterestsCommand>> =
                await this.domainHttpAdapter.get(`/interests/categories`);

            if (!httpResponse.parsedBody) {
                return new Error('errors.global');
            }

            return httpResponse.parsedBody.items.map((category) => categoryInterestsCommandToDomain(category));
        } catch (error: any) {
            return new Error('errors.global');
        }
    }
}

export default GetAllInterestCategoriesUsecase;
