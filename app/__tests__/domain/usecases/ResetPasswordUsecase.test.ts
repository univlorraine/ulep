import ResetPasswordUsecase from '../../../src/domain/usecases/ResetPasswordUsecase';
import HttpAdapter from '../../mocks/adapters/HttpAdapter';

describe('ResetPasswordUsecase', () => {
    let adapter: HttpAdapter;
    let usecase: ResetPasswordUsecase;
    beforeAll(() => {
        adapter = new HttpAdapter();
        usecase = new ResetPasswordUsecase(adapter);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('execute function must call DomainHttpAdapter with specific path and params', async () => {
        expect.assertions(2);
        jest.spyOn(adapter, 'post');
        adapter.mockJson({ parsedBody: {} });
        await usecase.execute('email');
        expect(adapter.post).toHaveBeenCalledTimes(1);
        expect(adapter.post).toHaveBeenCalledWith(
            '/authentication/reset-password',
            {
                email: 'email',
            },
            {},
            undefined,
            false
        );
    });

    it('execute must return an expected response without parsed body', async () => {
        expect.assertions(1);

        adapter.mockJson({});

        const result = await usecase.execute('email');
        expect(result).toBeInstanceOf(Error);
    });

    it('execute must return an error if adapter return an error without status', async () => {
        expect.assertions(1);
        adapter.mockError({});
        const result = await usecase.execute('email');
        expect(result).toStrictEqual(new Error('errors.global'));
    });
});
