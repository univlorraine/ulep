import EditUserUsecaseInterface from '../../../src/domain/interfaces/EditUserUsecase.interface';
import EditUserUsecase from '../../../src/domain/usecases/EditUserUsecase';
import userResult from '../../fixtures/user';
import DomainHttpAdapter from '../../mocks/adapters/HttpAdapter';

const payload = userResult;

const file = new File(['Bits'], 'name');
describe('editUserUsecase', () => {
    let adapter: DomainHttpAdapter;
    let usecase: EditUserUsecaseInterface;
    let mockedSetUser: Function;
    beforeAll(() => {
        adapter = new DomainHttpAdapter();
        mockedSetUser = jest.fn();
        usecase = new EditUserUsecase(adapter, mockedSetUser);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('execute function must call DomainHttpAdapter with specific path and params', async () => {
        expect.assertions(2);
        jest.spyOn(adapter, 'post');
        adapter.mockJson({ parsedBody: payload });
        await usecase.execute('id', 22, 'email', 'firstname', 'MALE', 'lastname', file);
        expect(adapter.post).toHaveBeenCalledTimes(1);
        expect(adapter.post).toHaveBeenCalledWith(
            '/users/id/',
            {
                email: 'email',
                firstname: 'firstname',
                lastname: 'lastname',
                gender: 'MALE',
                age: 22,
                file: file,
            },
            {},
            'multipart/form-data'
        );
    });

    it('execute must return an expected response', async () => {
        expect.assertions(1);

        adapter.mockJson({ parsedBody: payload });

        await usecase.execute('id', 22, 'email', 'firstname', 'MALE', 'lastname', file);
        expect(mockedSetUser).toHaveBeenCalledTimes(1);
    });

    it('execute must return an np payload', async () => {
        expect.assertions(1);
        adapter.mockJson({});
        const result = await usecase.execute('id', 22, 'email', 'firstname', 'MALE', 'lastname', file);

        expect(result).toStrictEqual(new Error('errors.global'));
    });

    it('execute must return an error if adapter return an error', async () => {
        expect.assertions(1);
        adapter.mockError({ status: 407 });
        const result = await usecase.execute('id', 22, 'email', 'firstname', 'MALE', 'lastname', file);

        expect(result).toStrictEqual(new Error('errors.global'));
    });

    it('execute must return an error if adapter return an error without status', async () => {
        expect.assertions(1);
        adapter.mockError({});
        const result = await usecase.execute('id', 22, 'email', 'firstname', 'MALE', 'lastname', file);

        expect(result).toStrictEqual(new Error('errors.global'));
    });

    it('execute must return an error if adapter has unexpected error body', async () => {
        expect.assertions(1);
        adapter.mockError({ error: { statusCode: 500 } });
        const result = await usecase.execute('id', 22, 'email', 'firstname', 'MALE', 'lastname', file);

        expect(result).toStrictEqual(new Error('errors.global'));
    });

    it('execute must return an error if adapter has code 401 ', async () => {
        expect.assertions(1);
        adapter.mockError({ error: { statusCode: 401, message: 'unauthorized' } });
        const result = await usecase.execute('id', 22, 'email', 'firstname', 'MALE', 'lastname', file);

        expect(result).toStrictEqual(new Error('signup_informations_page.error_unauthorized'));
    });

    it('execute must return an error if adapter has code 409 ', async () => {
        expect.assertions(1);
        adapter.mockError({ error: { statusCode: 409, message: 'email already exist' } });
        const result = await usecase.execute('id', 22, 'email', 'firstname', 'MALE', 'lastname', file);

        expect(result).toStrictEqual(new Error('signup_informations_page.error_email_already_exist'));
    });

    it('execute must return an error if adapter has code 400 with image weight error message', async () => {
        expect.assertions(1);
        adapter.mockError({ error: { statusCode: 400, message: 'expected size' } });
        const result = await usecase.execute('id', 22, 'email', 'firstname', 'MALE', 'lastname', file);

        expect(result).toStrictEqual(new Error('signup_informations_page.error_picture_weight'));
    });

    it('execute must return an error if adapter has code 400 with image type error message', async () => {
        expect.assertions(1);
        adapter.mockError({ error: { statusCode: 400, message: 'expected type' } });
        const result = await usecase.execute('id', 22, 'email', 'firstname', 'MALE', 'lastname', file);

        expect(result).toStrictEqual(new Error('signup_informations_page.error_picture_format'));
    });
});
