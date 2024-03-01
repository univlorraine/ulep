import ProfileCommand from '../../../src/command/ProfileCommand';
import Profile from '../../../src/domain/entities/Profile';
import GetProfileUsecase from '../../../src/domain/usecases/GetProfileUsecase';
import DomainHttpAdapter from '../../mocks/adapters/HttpAdapter';

const payload: ProfileCommand = {
    id: 'id',
    interests: [{ id: 'interestId', name: 'name' }],
    nativeLanguage: {
        code: 'FR',
        name: 'Français',
    },
    masteredLanguages: [{ code: 'EN', name: 'English' }],
    learningLanguages: [
        {
            id: 'id',
            code: 'CN',
            level: 'AO',
            name: 'Chinese',
        },
    ],
    objectives: [{ id: 'id', name: 'name', image: { id: 'id', mimeType: 'image/jpg' } }],
    meetingFrequency: 'ONCE_A_WEEK',
    biography: {
        anecdote: 'anecdote',
        experience: 'experience',
        favoritePlace: 'place',
        superpower: 'power',
    },
    availabilities: {
        monday: 'AVAILABLE',
        tuesday: 'AVAILABLE',
        wednesday: 'AVAILABLE',
        thursday: 'AVAILABLE',
        friday: 'AVAILABLE',
        saturday: 'AVAILABLE',
        sunday: 'AVAILABLE',
    },
    availabilitiesNote: 'note',
    user: {
        id: 'userId',
        avatar: { id: 'avatarId', mimeType: 'image/png' },
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
            openServiceDate: new Date('2023-01-01T00:00:00.000Z'),
            closeServiceDate: new Date('2023-01-01T00:00:00.000Z'),
            maxTandemsPerUser: 3,
        },
        status: 'ACTIVE',
        staffFunction: 'some job',
        role: "STAFF",
        gender: "MALE",
        division: 'some division',
        diploma: 'some diploma',
        country: 'FR',
        age: 25
    },
};

describe('getProfile', () => {
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
        await usecase.execute('accessToken');
        expect(adapter.get).toHaveBeenCalledTimes(1);
        expect(adapter.get).toHaveBeenCalledWith('/profiles/me', undefined, false, 'accessToken');
    });

    it('execute must return an expected response', async () => {
        expect.assertions(1);

        adapter.mockJson({ parsedBody: payload });

        const result = await usecase.execute('accessToken');
        expect(result).toBeInstanceOf(Profile);
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
