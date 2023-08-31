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
            const httpResponse: HttpResponse<CountryCommand[]> = await this.domainHttpAdapter.get(
                `/countries/universities`,
                {},
                false
            );

            if (!httpResponse.parsedBody || !httpResponse.parsedBody) {
                return new Error('errors.global');
            }

            return httpResponse.parsedBody.map((country) => countryCommandToDomain(country));
        } catch (error: any) {
            return new Error('errors.global');
        }
    }
}

export default GetAllCountriesUsecase;
