import ProfileCommand from '../../../src/command/ProfileCommand';
import Language from '../../../src/domain/entities/Language';
import CreateOrUpdateTestedLanguageUsecase from '../../../src/domain/usecases/CreateOrUpdateTestedLanguageUsecase';
import userResult from '../../fixtures/user';
import DomainHttpAdapter from '../../mocks/adapters/HttpAdapter';

const language = new Language('fr', 'fr', 'French');

const payload: ProfileCommand = {
    id: 'id',
    interests: [{ id: 'interestId', name: 'name' }],
    nativeLanguage: {
        code: 'FR',
        name: 'Français',
    },
    masteredLanguages: [{ code: 'EN', name: 'English' }],
    testedLanguages: [{ code: 'FR', name: 'French', level: 'A1' }],
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
    user: userResult,
};

describe('createOrUpdateTestedLanguage', () => {
    let adapter: DomainHttpAdapter;
    let mockedSetProfile: Function;
    let usecase: CreateOrUpdateTestedLanguageUsecase;
    beforeAll(() => {
        adapter = new DomainHttpAdapter();
        mockedSetProfile = jest.fn();
        usecase = new CreateOrUpdateTestedLanguageUsecase(adapter, mockedSetProfile);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('execute function must call DomainHttpAdapter with specific path and params', async () => {
        expect.assertions(2);
        jest.spyOn(adapter, 'post');
        adapter.mockJson({ parsedBody: {} });
        await usecase.execute('id', language, 'A1');
        expect(adapter.post).toHaveBeenCalledTimes(1);
        expect(adapter.post).toHaveBeenCalledWith('/profiles/id/tested-language', {
            code: 'fr',
            level: 'A1',
        });
    });

    it('execute must return an expected response', async () => {
        expect.assertions(2);

        adapter.mockJson({ parsedBody: payload });

        const result = await usecase.execute('id', language, 'A1');

        expect(mockedSetProfile).toHaveBeenCalledTimes(1);
        expect(result).toBeUndefined();
    });

    it('execute must return an expected response without parsed body', async () => {
        expect.assertions(1);

        adapter.mockJson({});

        const result = await usecase.execute('id', language, 'A1');

        expect(result).toBeInstanceOf(Error);
    });

    it('execute must return an error if adapter return an error without status', async () => {
        expect.assertions(1);
        adapter.mockError({});
        const result = await usecase.execute('id', language, 'A1');

        expect(result).toStrictEqual(new Error('errors.global'));
    });
});
