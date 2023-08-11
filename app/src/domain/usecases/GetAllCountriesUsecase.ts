import { HttpResponse } from '../../adapter/BaseHttpAdapter';
import { HttpAdapterInterface } from '../../adapter/DomainHttpAdapter';
import { CollectionCommand } from '../../command/CollectionCommand';
import CountryCommand, { countryCommandToDomain } from '../../command/CountryCommand';
import Country from '../entities/Country';
import GetAllCountriesUsecaseInterface from '../interfaces/GetAllCountriesUsecase.interface';

class GetAllCountriesUsecase implements GetAllCountriesUsecaseInterface {
    constructor(private readonly domainHttpAdapter: HttpAdapterInterface) {}

    async execute(): Promise<Country[] | Error> {
        try {
            const httpResponse: HttpResponse<CollectionCommand<CountryCommand>> = await this.domainHttpAdapter.get(
                `/countries?enable=true&pagination=false`,
                {},
                false
            );

            if (!httpResponse.parsedBody || !httpResponse.parsedBody.items) {
                return new Error('errors.global');
            }

            return httpResponse.parsedBody.items.map((country) => countryCommandToDomain(country));
        } catch (error: any) {
            return new Error('errors.global');
        }
    }
}

export default GetAllCountriesUsecase;
