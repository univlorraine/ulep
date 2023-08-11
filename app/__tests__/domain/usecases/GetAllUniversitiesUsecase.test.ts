import { CollectionCommand } from '../../../src/command/CollectionCommand';
import UniversityCommand from '../../../src/command/UniversityCommand';
import Language from '../../../src/domain/entities/Language';
import University from '../../../src/domain/entities/University';
import GetAllUniversitiesUsecase from '../../../src/domain/usecases/GetAllUniversitiesUsecase';
import DomainHttpAdapter from '../../mocks/adapters/HttpAdapter';

const usecaseResponse: CollectionCommand<UniversityCommand> = {items: [
    {
        id: 'id',
        name: 'name',
        sites: ['Campus A', 'Campus B'],
        languages: [new Language('id', 'FR', 'French'), new Language('id2', 'CN', 'Chinese')],
        parent: undefined,
        timezone: 'timezone',
        website: 'website',
    },
], totalItems: 1};

describe('getAllUniversities', () => {
    let adapter: DomainHttpAdapter;
    let usecase: GetAllUniversitiesUsecase;
    beforeAll(() => {
        adapter = new DomainHttpAdapter();
        usecase = new GetAllUniversitiesUsecase(adapter);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('execute function must call DomainHttpAdapter with specific path and params', async () => {
        expect.assertions(2);
        jest.spyOn(adapter, 'get');
        adapter.mockJson({ parsedBody: usecaseResponse });
        await usecase.execute();
        expect(adapter.get).toHaveBeenCalledTimes(1);
        expect(adapter.get).toHaveBeenCalledWith('/universities');
    });

    it('execute must return an expected response', async () => {
        expect.assertions(1);

        adapter.mockJson({ parsedBody: usecaseResponse });

        const result = (await usecase.execute()) as University[];
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
