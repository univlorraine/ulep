import LoginUsecase from '../../../src/domain/usecases/LoginUsecase';
import DomainHttpAdapter from '../../mocks/adapters/HttpAdapter';

describe('loginUsecase', () => {
    let adapter: DomainHttpAdapter;
    let usecase: LoginUsecase;
    let mockedSetTokens: Function;
    beforeAll(() => {
        mockedSetTokens = jest.fn();
        adapter = new DomainHttpAdapter();
        usecase = new LoginUsecase(adapter, mockedSetTokens);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('execute function must call DomainHttpAdapter with specific path and params', async () => {
        expect.assertions(2);
        jest.spyOn(adapter, 'post');
        adapter.mockJson({ parsedBody: { accessToken: 'accessToken', refreshToken: 'refreshToken' } });
        await usecase.execute('email', 'password');
        expect(adapter.post).toHaveBeenCalledTimes(1);
        expect(adapter.post).toHaveBeenCalledWith('/authentication/token', { email: 'email', password: 'password' });
    });

    it('execute must return an expected response', async () => {
        expect.assertions(2);

        adapter.mockJson({ parsedBody: { accessToken: 'accessToken', refreshToken: 'refreshToken' } });

        await usecase.execute('email', 'password');
        expect(mockedSetTokens).toHaveBeenCalledTimes(1);
        expect(mockedSetTokens).toHaveBeenCalledWith({ accessToken: 'accessToken', refreshToken: 'refreshToken' });
    });

    it('execute must return an expected response without parsed body', async () => {
        expect.assertions(2);

        adapter.mockJson({});

        const result = await usecase.execute('email', 'password');
        expect(mockedSetTokens).toHaveBeenCalledTimes(0);
        expect(result).toBeInstanceOf(Error);
    });

    it('execute must return an error if adapter return an 401 error', async () => {
        expect.assertions(1);
        adapter.mockError({ status: 401 });
        const result = await usecase.execute('email', 'password');
        expect(result).toStrictEqual(new Error('errors.userWrongCredentials'));
    });

    it('execute must return an error if adapter return a 404 error', async () => {
        expect.assertions(1);
        adapter.mockError({ status: 404 });
        const result = await usecase.execute('email', 'password');
        expect(result).toStrictEqual(new Error('errors.userDoesntExist'));
    });

    it('execute must return an error if adapter return an error', async () => {
        expect.assertions(1);
        adapter.mockError({ status: 407 });
        const result = await usecase.execute('email', 'password');
        expect(result).toStrictEqual(new Error('errors.global'));
    });

    it('execute must return an error if adapter return an error without status', async () => {
        expect.assertions(1);
        adapter.mockError({});
        const result = await usecase.execute('email', 'password');
        expect(result).toStrictEqual(new Error('errors.global'));
    });
});
