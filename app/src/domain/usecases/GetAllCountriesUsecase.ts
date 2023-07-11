import { HttpResponse } from '../../adapter/BaseHttpAdapter';
import { HttpAdapterInterface } from '../../adapter/DomainHttpAdapter';
import Country from '../entities/Country';
import GetAllCountriesUsecaseInterface from '../interfaces/GetAllCountriesUsecase.interface';

interface CountryCommand {
    id: string;
    code: string;
    name: string;
}

interface GetAllCountriesCommand {
    items: CountryCommand[];
    totalItems: number;
}

class GetAllCountriesUsecase implements GetAllCountriesUsecaseInterface {
    constructor(private readonly domainHttpAdapter: HttpAdapterInterface) {}

    async execute(): Promise<Country[] | Error> {
        try {
            const httpRepsonse: HttpResponse<GetAllCountriesCommand> = await this.domainHttpAdapter.get(`/countries`);

            if (!httpRepsonse.parsedBody || !httpRepsonse.parsedBody.items) {
                return new Error('errors.global');
            }

            return httpRepsonse.parsedBody.items.map((country) => new Country(country.id, country.code, country.name));
        } catch (error: any) {
            return new Error('errors.global');
        }
    }
}

export default GetAllCountriesUsecase;
