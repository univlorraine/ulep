import ProfileCommand from '../../../src/command/ProfileCommand';
import { BiographySignUp } from '../../../src/domain/entities/ProfileSignUp';
import CreateProfileUsecase from '../../../src/domain/usecases/CreateProfileUsecase';
import DomainHttpAdapter from '../../mocks/adapters/HttpAdapter';

const biography = {
    incredible: 'incredible',
    place: 'place',
    power: 'power',
    travel: 'travel',
} as BiographySignUp;

const payload: ProfileCommand = {
    id: 'id',
    interests: [{ id: 'interestId', name: 'name' }],
    nativeLanguage: {
        code: 'FR',
        name: 'Français',
    },
    masteredLanguages: [{ code: 'EN', name: 'English' }],
    learningLanguages: [],
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
    },
};

describe('createProfile', () => {
    let adapter: DomainHttpAdapter;
    let mockedSetProfile: Function;
    let usecase: CreateProfileUsecase;
    beforeAll(() => {
        adapter = new DomainHttpAdapter();
        mockedSetProfile = jest.fn();
        usecase = new CreateProfileUsecase(adapter, mockedSetProfile);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('execute function must call DomainHttpAdapter with specific path and params', async () => {
        expect.assertions(2);
        jest.spyOn(adapter, 'post');
        adapter.mockJson({ parsedBody: {} });
        await usecase.execute(
            'FR',
            ['CN'],
            ['goalId'],
            'ONCE_A_WEEK',
            ['interestsId'],
            biography,
            {
                monday: 'AVAILABLE',
                tuesday: 'AVAILABLE',
                wednesday: 'AVAILABLE',
                thursday: 'AVAILABLE',
                friday: 'AVAILABLE',
                saturday: 'AVAILABLE',
                sunday: 'AVAILABLE',
            },
            'note'
        );
        expect(adapter.post).toHaveBeenCalledTimes(1);
        expect(adapter.post).toHaveBeenCalledWith('/profiles/', {
            nativeLanguageCode: 'FR',
            masteredLanguageCodes: ['CN'],
            objectives: ['goalId'],
            meetingFrequency: 'ONCE_A_WEEK',
            interests: ['interestsId'],
            learningLanguages: [],
            biography: {
                superpower: biography.power,
                favoritePlace: biography.place,
                experience: biography.travel,
                anecdote: biography.incredible,
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
            availabilitiesNotePrivacy: undefined,
        });
    });

    it('execute must return an expected response', async () => {
        expect.assertions(2);

        adapter.mockJson({ parsedBody: payload });

        const result = await usecase.execute(
            'FR',
            ['CN'],
            ['goalId'],
            'ONCE_A_WEEK',
            ['interestsId'],
            biography,
            {
                monday: 'AVAILABLE',
                tuesday: 'AVAILABLE',
                wednesday: 'AVAILABLE',
                thursday: 'AVAILABLE',
                friday: 'AVAILABLE',
                saturday: 'AVAILABLE',
                sunday: 'AVAILABLE',
            },
            'note'
        );
        expect(mockedSetProfile).toHaveBeenCalledTimes(1);
        expect(result).toBeUndefined();
    });

    it('execute must return an expected response without parsed body', async () => {
        expect.assertions(1);

        adapter.mockJson({});

        const result = await usecase.execute(
            'FR',
            ['CN'],
            ['goalId'],
            'ONCE_A_WEEK',
            ['interestsId'],
            biography,
            {
                monday: 'AVAILABLE',
                tuesday: 'AVAILABLE',
                wednesday: 'AVAILABLE',
                thursday: 'AVAILABLE',
                friday: 'AVAILABLE',
                saturday: 'AVAILABLE',
                sunday: 'AVAILABLE',
            },
            'note'
        );
        expect(result).toBeInstanceOf(Error);
    });

    it('execute must return an error if adapter return an error without status', async () => {
        expect.assertions(1);
        adapter.mockError({});
        const result = await usecase.execute(
            'FR',
            ['CN'],
            ['goalId'],
            'ONCE_A_WEEK',
            ['interestsId'],
            biography,
            {
                monday: 'AVAILABLE',
                tuesday: 'AVAILABLE',
                wednesday: 'AVAILABLE',
                thursday: 'AVAILABLE',
                friday: 'AVAILABLE',
                saturday: 'AVAILABLE',
                sunday: 'AVAILABLE',
            },
            'note'
        );
        expect(result).toStrictEqual(new Error('errors.global'));
    });
});
