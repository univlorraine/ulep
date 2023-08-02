import CreateReportUsecase from '../../../src/domain/usecases/CreateReportUsecase';
import DomainHttpAdapter from '../../mocks/adapters/HttpAdapter';

describe('createReport', () => {
    let adapter: DomainHttpAdapter;
    let usecase: CreateReportUsecase;
    beforeAll(() => {
        adapter = new DomainHttpAdapter();
        usecase = new CreateReportUsecase(adapter);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('execute function must call DomainHttpAdapter with specific path and params', async () => {
        expect.assertions(2);
        jest.spyOn(adapter, 'post');
        adapter.mockJson({ parsedBody: {} });
        await usecase.execute('id', 'content');
        expect(adapter.post).toHaveBeenCalledTimes(1);
        expect(adapter.post).toHaveBeenCalledWith('/reports/', { category: 'id', content: 'content' });
    });

    it('execute must return an expected response', async () => {
        expect.assertions(1);

        adapter.mockJson({ parsedBody: {} });

        const result = await usecase.execute('id', 'content');
        expect(result).toBeUndefined();
    });

    it('execute must return an expected response without parsed body', async () => {
        expect.assertions(1);

        adapter.mockJson({});

        const result = await usecase.execute('id', 'content');
        expect(result).toBeInstanceOf(Error);
    });

    it('execute must return an error if adapter return an error without status', async () => {
        expect.assertions(1);
        adapter.mockError({});
        const result = await usecase.execute('id', 'content');
        expect(result).toStrictEqual(new Error('errors.global'));
    });
});
