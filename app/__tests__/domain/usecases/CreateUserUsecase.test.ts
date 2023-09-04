import UserCommand from '../../../src/command/UserCommand';
import University from '../../../src/domain/entities/University';
import LoginUsecaseInterface from '../../../src/domain/interfaces/LoginUsecase.interface';
import CreateUserUsecase from '../../../src/domain/usecases/CreateUserUsecase';
import DomainHttpAdapter from '../../mocks/adapters/HttpAdapter';
import LoginUsecase from '../../mocks/usecase/LoginUsecase';

const payload: UserCommand = {
    id: 'id',
    avatar: { id: 'id', url: 'url' },
    email: 'email',
    firstname: 'firstname',
    lastname: 'lastname',
    university: {
        id: 'universityId',
        admissionStart: new Date('2023-01-01T00:00:00.000Z'),
        admissionEnd: new Date('2023-12-31T00:00:00.000Z'),
        name: 'name',
        parent: undefined,
        sites: [],
        timezone: 'timezone',
        website: 'site',
    },
    status: 'ACTIVE',
};

const university = new University(
    'id',
    'name',
    false,
    'timezone',
    [{ id: 'id', name: 'Site A' }],
    new Date('2023-01-01T00:00:00.000Z'),
    new Date('2023-12-31T00:00:00.000Z')
);
const file = new File(['Bits'], 'name');
describe('createUserUsecase', () => {
    let adapter: DomainHttpAdapter;
    let usecase: CreateUserUsecase;
    let mockedLogin: LoginUsecaseInterface;
    let mockedSetUser: Function;
    beforeAll(() => {
        adapter = new DomainHttpAdapter();
        mockedLogin = new LoginUsecase();
        mockedSetUser = jest.fn();
        usecase = new CreateUserUsecase(adapter, mockedLogin, mockedSetUser);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('execute function must call DomainHttpAdapter with specific path and params', async () => {
        expect.assertions(2);
        jest.spyOn(adapter, 'post');
        adapter.mockJson({ parsedBody: payload });
        await usecase.execute(
            'email',
            'password',
            'firstname',
            'lastname',
            'male',
            'CODE',
            22,
            university,
            'student',
            'FR',
            file
        );
        expect(adapter.post).toHaveBeenCalledTimes(1);
        expect(adapter.post).toHaveBeenCalledWith(
            '/users',
            {
                email: 'email',
                password: 'password',
                firstname: 'firstname',
                lastname: 'lastname',
                gender: 'male',
                code: 'CODE',
                age: 22,
                university: university.id,
                role: 'student',
                countryCode: 'FR',
                file: file,
            },
            {},
            'multipart/form-data',
            false
        );
    });

    it('execute must return an expected response', async () => {
        expect.assertions(3);

        adapter.mockJson({ parsedBody: payload });
        const spyExecute = jest.spyOn(mockedLogin, 'execute');

        await usecase.execute(
            'email',
            'password',
            'firstname',
            'lastname',
            'male',
            'CODE',
            22,
            university,
            'student',
            'FR',
            file
        );
        expect(mockedSetUser).toHaveBeenCalledTimes(1);
        expect(spyExecute).toHaveBeenCalledTimes(1);
        expect(spyExecute).toHaveBeenCalledWith('email', 'password');
    });

    it('execute must return an np payload', async () => {
        expect.assertions(1);
        adapter.mockJson({});
        const result = await usecase.execute(
            'email',
            'password',
            'firstname',
            'lastname',
            'male',
            'CODE',
            22,
            university,
            'student',
            'FR',
            file
        );
        expect(result).toStrictEqual(new Error('errors.global'));
    });

    it('execute must return an error if adapter return an error', async () => {
        expect.assertions(1);
        adapter.mockError({ status: 407 });
        const result = await usecase.execute(
            'email',
            'password',
            'firstname',
            'lastname',
            'male',
            'CODE',
            22,
            university,
            'student',
            'FR',
            file
        );
        expect(result).toStrictEqual(new Error('errors.global'));
    });

    it('execute must return an error if adapter return an error without status', async () => {
        expect.assertions(1);
        adapter.mockError({});
        const result = await usecase.execute(
            'email',
            'password',
            'firstname',
            'lastname',
            'male',
            'CODE',
            22,
            university,
            'student',
            'FR',
            file
        );
        expect(result).toStrictEqual(new Error('errors.global'));
    });

    it('execute must return an error if adapter has unexpected error body', async () => {
        expect.assertions(1);
        adapter.mockError({ error: { statusCode: 500 } });
        const result = await usecase.execute(
            'email',
            'password',
            'firstname',
            'lastname',
            'male',
            'CODE',
            22,
            university,
            'student',
            'FR',
            file
        );
        expect(result).toStrictEqual(new Error('signup_informations_page.error_code'));
    });

    it('execute must return an error if adapter has code 400 with code error message', async () => {
        expect.assertions(1);
        adapter.mockError({ error: { statusCode: 400, message: 'Code is invalid' } });
        const result = await usecase.execute(
            'email',
            'password',
            'firstname',
            'lastname',
            'male',
            'CODE',
            22,
            university,
            'student',
            'FR',
            file
        );
        expect(result).toStrictEqual(new Error('signup_informations_page.error_code'));
    });

    it('execute must return an error if adapter has code 400 with domain error message', async () => {
        expect.assertions(1);
        adapter.mockError({ error: { statusCode: 400, message: 'Domain is invalid' } });
        const result = await usecase.execute(
            'email',
            'password',
            'firstname',
            'lastname',
            'male',
            'CODE',
            22,
            university,
            'student',
            'FR',
            file
        );
        expect(result).toStrictEqual(new Error('signup_informations_page.error_domain'));
    });
});
