import UserCommand from '../../../src/command/UserCommand';
import User from '../../../src/domain/entities/User';
import GetUserUsecase from '../../../src/domain/usecases/GetUserUsecase';
import DomainHttpAdapter from '../../mocks/adapters/HttpAdapter';

const payload: UserCommand = {
    id: 'userId',
    avatar: { id: 'avatarId', url: 'url' },
    acceptsEmail: true,
    email: 'email',
    firstname: 'firstname',
    lastname: 'lastname',
    university: {
        id: 'universityId',
        name: 'name',
        parent: undefined,
        sites: [],
        hasCode: true,
        timezone: 'timezone',
        website: 'site',
        admissionStart: new Date('2023-01-01T00:00:00.000Z'),
        admissionEnd: new Date('2023-12-31T00:00:00.000Z'),
    },
    status: 'ACTIVE',
};

describe('getUser', () => {
    let adapter: DomainHttpAdapter;
    let usecase: GetUserUsecase;
    beforeAll(() => {
        adapter = new DomainHttpAdapter();
        usecase = new GetUserUsecase(adapter);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('execute function must call DomainHttpAdapter with specific path and params', async () => {
        expect.assertions(2);
        jest.spyOn(adapter, 'get');
        adapter.mockJson({ parsedBody: {} });
        await usecase.execute('accessToken');
        expect(adapter.get).toHaveBeenCalledTimes(1);
        expect(adapter.get).toHaveBeenCalledWith('/users/me', {}, false, 'accessToken');
    });

    it('execute must return an expected response', async () => {
        expect.assertions(1);

        adapter.mockJson({ parsedBody: payload });

        const result = await usecase.execute('accessToken');
        expect(result).toBeInstanceOf(User);
    });

    it('execute must return an expected response without parsed body', async () => {
        expect.assertions(1);

        adapter.mockJson({});

        const result = await usecase.execute('accessToken');
        expect(result).toBeInstanceOf(Error);
    });

    it('execute must return an error if adapter return an error without status', async () => {
        expect.assertions(1);
        adapter.mockError({});
        const result = await usecase.execute('accessToken');
        expect(result).toStrictEqual(new Error('errors.global'));
    });
});
