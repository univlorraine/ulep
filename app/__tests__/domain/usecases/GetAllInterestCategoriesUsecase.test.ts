import CategoryInterestsCommand from '../../../src/command/CategoryInterestsCommand';
import { CollectionCommand } from '../../../src/command/CollectionCommand';
import CategoryInterests from '../../../src/domain/entities/CategoryInterests';
import GetAllInterestCategoriesUsecase from '../../../src/domain/usecases/GetAllInterestCategoriesUsecase';
import DomainHttpAdapter from '../../mocks/adapters/HttpAdapter';

const httpCallResponse: CollectionCommand<CategoryInterestsCommand> = {
    items: [{ id: 'id', name: 'name', interests: [{ id: 'id', name: 'name' }] }],
    totalItems: 1,
};

describe('getAllGoals', () => {
    let adapter: DomainHttpAdapter;
    let usecase: GetAllInterestCategoriesUsecase;
    beforeAll(() => {
        adapter = new DomainHttpAdapter();
        usecase = new GetAllInterestCategoriesUsecase(adapter);
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
        expect(adapter.get).toHaveBeenCalledWith('/interests/categories');
    });

    it('execute must return an expected response', async () => {
        expect.assertions(1);

        adapter.mockJson({ parsedBody: httpCallResponse });

        const result = (await usecase.execute()) as CategoryInterests[];
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
