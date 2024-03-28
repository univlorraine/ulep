import { CollectionCommand } from '../../../src/command/CollectionCommand';
import CountryCommand from '../../../src/command/CountryCommand';
import Country from '../../../src/domain/entities/Country';
import GetAllCountriesUsecase from '../../../src/domain/usecases/GetAllCountriesUsecase';
import DomainHttpAdapter from '../../mocks/adapters/HttpAdapter';

const httpCallResponse: CountryCommand[] = [{ id: 'id', name: 'name', code: 'code', emoji: '🤖', universities: [] }];

describe('getAllCountries', () => {
    let adapter: DomainHttpAdapter;
    let usecase: GetAllCountriesUsecase;
    beforeAll(() => {
        adapter = new DomainHttpAdapter();
        usecase = new GetAllCountriesUsecase(adapter);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('execute function must call DomainHttpAdapter with specific path and params', async () => {
        expect.assertions(2);
        jest.spyOn(adapter, 'get');
        adapter.mockJson({ parsedBody: httpCallResponse });
        await usecase.execute();
        expect(adapter.get).toHaveBeenCalledTimes(1);
        expect(adapter.get).toHaveBeenCalledWith('/countries/universities', {}, false);
    });

    it('execute must return an expected response', async () => {
        expect.assertions(1);

        adapter.mockJson({ parsedBody: httpCallResponse });

        const result = (await usecase.execute()) as Country[];
        expect(result).toHaveLength(1);
    });

    it('execute must return an expected response without parsed body', async () => {
        expect.assertions(1);

        adapter.mockJson({});

        const result = await usecase.execute();
        expect(result).toBeInstanceOf(Error);
    });

    it('execute must return an error if adapter return an error without status', async () => {
        expect.assertions(1);
        adapter.mockError({});
        const result = await usecase.execute();
        expect(result).toStrictEqual(new Error('errors.global'));
    });
});
