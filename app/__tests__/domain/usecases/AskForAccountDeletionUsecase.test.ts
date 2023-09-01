import { LanguageAskedCommand } from '../../../src/command/LanguageCommand';
import AskForAccountDeletionUsecase from '../../../src/domain/usecases/AskForAccountDeletionUsecase';
import DomainHttpAdapter from '../../mocks/adapters/HttpAdapter';

const usecaseResponse: LanguageAskedCommand = { code: 'FR', count: 10 };

describe('getAllCountries', () => {
    let adapter: DomainHttpAdapter;
    let usecase: AskForAccountDeletionUsecase;
    beforeAll(() => {
        adapter = new DomainHttpAdapter();
        usecase = new AskForAccountDeletionUsecase(adapter);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('execute function must call DomainHttpAdapter with specific path and params', async () => {
        expect.assertions(2);
        jest.spyOn(adapter, 'post');
        adapter.mockJson({ parsedBody: usecaseResponse });
        await usecase.execute();
        expect(adapter.post).toHaveBeenCalledTimes(1);
        expect(adapter.post).toHaveBeenCalledWith(`/reports/unsubscribe`, {});
    });

    it('execute must return an expected response', async () => {
        expect.assertions(1);

        adapter.mockJson({ parsedBody: usecaseResponse });

        const result = await usecase.execute();
        expect(result).toBe(undefined);
    });

    it('execute must return an expected response without parsed body', async () => {
        expect.assertions(1);

        adapter.mockJson({});

        const result = await usecase.execute();
        expect(result).toBeInstanceOf(Error);
    });

    it('execute 409 response without parsed body', async () => {
        expect.assertions(1);

        adapter.mockError({ status: 409 });

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
