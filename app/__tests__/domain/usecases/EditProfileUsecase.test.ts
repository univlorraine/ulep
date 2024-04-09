import ProfileCommand from '../../../src/command/ProfileCommand';
import Language from '../../../src/domain/entities/Language';
import ProfileSignUp, { BiographySignUp } from '../../../src/domain/entities/ProfileSignUp';
import EditProfileUsecase from '../../../src/domain/usecases/EditProfileUsecase';
import userResult from '../../fixtures/user';
import DomainHttpAdapter from '../../mocks/adapters/HttpAdapter';

const biography = {
    incredible: 'incredible',
    place: 'place',
    power: 'power',
    travel: 'travel',
} as BiographySignUp;

const profileSignUp: ProfileSignUp = {
    availabilities: {
        monday: 'AVAILABLE',
        tuesday: 'AVAILABLE',
        wednesday: 'AVAILABLE',
        thursday: 'AVAILABLE',
        friday: 'AVAILABLE',
        saturday: 'AVAILABLE',
        sunday: 'AVAILABLE',
    },
    availabilityNote: 'note',
    availabilityNotePrivate: false,
    biography: {
        power: 'power',
        place: 'place',
        travel: 'travel',
        incredible: 'incredible',
    },
    goals: [{ id: 'id', name: 'goalId' }],
    interests: ['interestId'],
    otherLanguages: [{ id: 'id', code: 'EN', name: 'English' }],
    frequency: 'ONCE_A_WEEK',
    nativeLanguage: {
        id: 'id',
        code: 'FR',
        name: 'Français',
    },
};

const payload: ProfileCommand = {
    id: 'id',
    interests: [{ id: 'interestId', name: 'name' }],
    nativeLanguage: {
        code: 'FR',
        name: 'Français',
    },
    masteredLanguages: [{ code: 'EN', name: 'English' }],
    learningLanguages: [],
    testedLanguages: [],
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
    availabilitiesNotePrivacy: false,
    user: userResult,
};

describe('editProfile', () => {
    let adapter: DomainHttpAdapter;
    let mockedSetProfile: Function;
    let usecase: EditProfileUsecase;
    beforeAll(() => {
        adapter = new DomainHttpAdapter();
        mockedSetProfile = jest.fn();
        usecase = new EditProfileUsecase(adapter, mockedSetProfile);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('execute function must call DomainHttpAdapter with specific path and params', async () => {
        expect.assertions(2);
        jest.spyOn(adapter, 'post');
        adapter.mockJson({ parsedBody: {} });
        await usecase.execute('id', profileSignUp);
        expect(adapter.post).toHaveBeenCalledTimes(1);
        expect(adapter.post).toHaveBeenCalledWith('/profiles/edit/id/', {
            age: profileSignUp.age,
            availabilities: profileSignUp.availabilities,
            availabilitiesNote: profileSignUp.availabilityNote,
            availabilitiesNotePrivacy: profileSignUp.availabilityNotePrivate,
            biography: {
                superpower: profileSignUp.biography?.power,
                favoritePlace: profileSignUp.biography?.place,
                experience: profileSignUp.biography?.travel,
                anecdote: profileSignUp.biography?.incredible,
            },
            firstname: profileSignUp.firstname,
            gender: profileSignUp.gender,
            interests: profileSignUp.interests,
            lastname: profileSignUp.lastname,
            masteredLanguageCodes: profileSignUp.otherLanguages?.map((language) => language.code),
            meetingFrequency: profileSignUp.frequency,
            nativeLanguageCode: profileSignUp.nativeLanguage?.code,
            objectives: profileSignUp.goals?.map((goal) => goal.id),
        });
    });

    it('execute must return an expected response', async () => {
        expect.assertions(2);

        adapter.mockJson({ parsedBody: payload });

        const result = await usecase.execute('id', profileSignUp);
        expect(mockedSetProfile).toHaveBeenCalledTimes(1);
        expect(result).toBeUndefined();
    });

    it('execute must return an expected response without parsed body', async () => {
        expect.assertions(1);

        adapter.mockJson({});

        const result = await usecase.execute('id', profileSignUp);
        expect(result).toBeInstanceOf(Error);
    });

    it('execute must return an error if adapter return an error without status', async () => {
        expect.assertions(1);
        adapter.mockError({});
        const result = await usecase.execute('id', profileSignUp);
        expect(result).toStrictEqual(new Error('errors.global'));
    });

    it('execute must return an error if adapter has code 401 with forbidden error message', async () => {
        expect.assertions(1);
        adapter.mockError({ error: { statusCode: 401, message: 'unauthorized' } });
        const result = await usecase.execute('id', profileSignUp);
        expect(result).toStrictEqual(new Error('signup_informations_page.error_unauthorized'));
    });

    it('execute must return an unexpected error', async () => {
        expect.assertions(1);
        adapter.mockError({ error: { statusCode: 409, message: 'unauthorized' } });
        const result = await usecase.execute('id', profileSignUp);
        expect(result).toStrictEqual(new Error('errors.global'));
    });
});
