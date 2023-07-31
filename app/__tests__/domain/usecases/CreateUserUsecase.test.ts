import University from '../../../src/domain/entities/University';
import LoginUsecaseInterface from '../../../src/domain/interfaces/LoginUsecase.interface';
import CreateUserUsecase from '../../../src/domain/usecases/CreateUserUsecase';
import DomainHttpAdapter from '../../mocks/adapters/HttpAdapter';
import LoginUsecase from '../../mocks/usecase/LoginUsecase';

const university = new University('id', 'name', false, ['FR', 'CN'], 'timezone', ['Site A']);
describe('createUserUsecase', () => {
    let adapter: DomainHttpAdapter;
    let usecase: CreateUserUsecase;
    let mockedLogin: LoginUsecaseInterface;
    beforeAll(() => {
        adapter = new DomainHttpAdapter();
        mockedLogin = new LoginUsecase();
        usecase = new CreateUserUsecase(adapter, mockedLogin);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('execute function must call DomainHttpAdapter with specific path and params', async () => {
        expect.assertions(2);
        jest.spyOn(adapter, 'post');
        adapter.mockJson({ parsedBody: {} });
        await usecase.execute('email', 'password', 'firstname', 'lastname', 'MALE', 22, university, 'STUDENT', 'FR');
        expect(adapter.post).toHaveBeenCalledTimes(1);
        expect(adapter.post).toHaveBeenCalledWith('/users/', {
            email: 'email',
            password: 'password',
            firstname: 'firstname',
            lastname: 'lastname',
            gender: 'MALE',
            age: 22,
            university: university.id,
            role: 'STUDENT',
            countryCode: 'FR',
        });
    });

    it('execute must return an expected response', async () => {
        expect.assertions(2);

        adapter.mockJson({ parsedBody: {} });
        const spyExecute = jest.spyOn(mockedLogin, 'execute');

        await usecase.execute('email', 'password', 'firstname', 'lastname', 'MALE', 22, university, 'STUDENT', 'FR');
        expect(spyExecute).toHaveBeenCalledTimes(1);
        expect(spyExecute).toHaveBeenCalledWith('email', 'password');
    });

    it('execute must return an error if adapter return an error', async () => {
        expect.assertions(1);
        adapter.mockError({ status: 407 });
        const result = await usecase.execute(
            'email',
            'password',
            'firstname',
            'lastname',
            'MALE',
            22,
            university,
            'STUDENT',
            'FR'
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
            'MALE',
            22,
            university,
            'STUDENT',
            'FR'
        );
        expect(result).toStrictEqual(new Error('errors.global'));
    });
});
