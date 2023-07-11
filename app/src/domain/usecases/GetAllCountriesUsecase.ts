import { HttpResponse } from '../../adapter/BaseHttpAdapter';
import { HttpAdapterInterface } from '../../adapter/DomainHttpAdapter';
import CountryCommand, { countryCommandToDomain } from '../../command/CountryCommand';
import Country from '../entities/Country';
import GetAllCountriesUsecaseInterface from '../interfaces/GetAllCountriesUsecase.interface';

class GetAllCountriesUsecase implements GetAllCountriesUsecaseInterface {
    constructor(private readonly domainHttpAdapter: HttpAdapterInterface) {}

    async execute(): Promise<Country[] | Error> {
        try {
            const httpRepsonse: HttpResponse<CollectionCommand<CountryCommand>> = await this.domainHttpAdapter.get(
                `/countries`
            );

            if (!httpRepsonse.parsedBody || !httpRepsonse.parsedBody.items) {
                return new Error('errors.global');
            }

            return httpRepsonse.parsedBody.items.map((country) => countryCommandToDomain(country));
        } catch (error: any) {
            return new Error('errors.global');
        }
    }
}

export default GetAllCountriesUsecase;
