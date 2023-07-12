import Country from '../entities/Country';

interface GetAllCountriesUsecaseInterface {
    execute(): Promise<Country[] | Error>;
}
export default GetAllCountriesUsecaseInterface;
