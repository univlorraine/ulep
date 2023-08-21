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
    },
    learningLanguage: {
        code: 'CN',
        level: 'AO',
    },
    objectives: [{ id: 'id', name: 'name', image: { id: 'id', url: 'url' } }],
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
            'id',
            'FR',
            ['CN'],
            'ES',
            'A0',
            'TANDEM',
            ['goalId'],
            'ONCE_A_WEEK',
            ['interestsId'],
            true,
            true,
            biography,
            true,
            true
        );
        expect(adapter.post).toHaveBeenCalledTimes(1);
        expect(adapter.post).toHaveBeenCalledWith('/profiles/', {
            id: 'id',
            nativeLanguageCode: 'FR',
            masteredLanguageCodes: ['CN'],
            learningLanguages: [{ code: 'ES', level: 'A0' }],
            learningType: 'TANDEM',
            objectives: ['goalId'],
            meetingFrequency: 'ONCE_A_WEEK',
            interests: ['interestsId'],
            sameAge: true,
            sameGender: true,
            biography: {
                superpower: biography.power,
                favoritePlace: biography.place,
                experience: biography.travel,
                anecdote: biography.incredible,
            },
            campusId: undefined,
            certificateOption: true,
            specificProgram: true,
        });
    });

    it('execute must return an expected response', async () => {
        expect.assertions(2);

        adapter.mockJson({ parsedBody: payload });

        const result = await usecase.execute(
            'id',
            'FR',
            ['CN'],
            'ES',
            'A0',
            'TANDEM',
            ['goalId'],
            'ONCE_A_WEEK',
            ['interestsId'],
            true,
            true,
            biography,
            true,
            true
        );
        expect(mockedSetProfile).toHaveBeenCalledTimes(1);
        expect(result).toBeUndefined();
    });

    it('execute must return an expected response without parsed body', async () => {
        expect.assertions(1);

        adapter.mockJson({});

        const result = await usecase.execute(
            'id',
            'FR',
            ['CN'],
            'ES',
            'A0',
            'TANDEM',
            ['goalId'],
            'ONCE_A_WEEK',
            ['interestsId'],
            true,
            true,
            biography,
            true,
            true
        );
        expect(result).toBeInstanceOf(Error);
    });

    it('execute must return an error if adapter return an error without status', async () => {
        expect.assertions(1);
        adapter.mockError({});
        const result = await usecase.execute(
            'id',
            'FR',
            ['CN'],
            'ES',
            'A0',
            'TANDEM',
            ['goalId'],
            'ONCE_A_WEEK',
            ['interestsId'],
            true,
            true,
            biography,
            true,
            true
        );
        expect(result).toStrictEqual(new Error('errors.global'));
    });
});
