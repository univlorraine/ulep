import ProfileCommand from '../../../src/command/ProfileCommand';
import Profile from '../../../src/domain/entities/Profile';
import GetProfileUsecase from '../../../src/domain/usecases/GetProfileUsecase';
import DomainHttpAdapter from '../../mocks/adapters/HttpAdapter';

const payload: ProfileCommand = {
    id: 'id',
    interests: [{ id: 'interestId', name: 'name' }],
    nativeLanguage: {
        code: 'FR',
    },
    learningLanguage: {
        code: 'CN',
        level: 'AO',
    },
    objectives: [{ id: 'id', name: 'name' }],
    meetingFrequency: 'ONCE_A_WEEK',
    biography: {
        anecdote: 'anecdote',
        experience: 'experience',
        favoritePlace: 'place',
        superpower: 'power',
    },
    user: {
        id: 'userId',
        avatar: { id: 'avatarId', url: 'url' },
        email: 'email',
        firstname: 'firstname',
        lastname: 'lastname',
        university: {
            id: 'universityId',
            languages: [{ id: 'id', code: 'FR', name: 'name' }],
            name: 'name',
            parent: undefined,
            sites: [],
            timezone: 'timezone',
            website: 'site',
        },
        deactivated: false,
    },
};

describe('createProfile', () => {
    let adapter: DomainHttpAdapter;
    let usecase: GetProfileUsecase;
    beforeAll(() => {
        adapter = new DomainHttpAdapter();
        usecase = new GetProfileUsecase(adapter);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('execute function must call DomainHttpAdapter with specific path and params', async () => {
        expect.assertions(2);
        jest.spyOn(adapter, 'get');
        adapter.mockJson({ parsedBody: {} });
        await usecase.execute();
        expect(adapter.get).toHaveBeenCalledTimes(1);
        expect(adapter.get).toHaveBeenCalledWith('/profiles/user', undefined, false);
    });

    it('execute must return an expected response', async () => {
        expect.assertions(1);

        adapter.mockJson({ parsedBody: payload });

        const result = await usecase.execute();
        expect(result).toBeInstanceOf(Profile);
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
