import TandemCommand from '../../../src/command/TandemCommand';
import Tandem from '../../../src/domain/entities/Tandem';
import GetAllTandemsUsecase from '../../../src/domain/usecases/GetAllTandemsUsecase';
import userResult from '../../fixtures/user';
import DomainHttpAdapter from '../../mocks/adapters/HttpAdapter';

const httpCallResponse: TandemCommand[] = [
    {
        id: 'id',
        status: 'DRAFT',
        partnerLearningLanguage: {
            id: 'id',
            level: 'B1',
            name: 'Français',
            learningType: 'ETANDEM',
            code: 'FR',
            profile: {
                id: 'id',
                interests: [{ id: 'interestId', name: 'name' }],
                nativeLanguage: {
                    code: 'FR',
                    name: 'Français',
                },
                masteredLanguages: [{ code: 'EN', name: 'English' }],
                testedLanguages: [],
                learningLanguages: [
                    {
                        id: 'id',
                        code: 'CN',
                        name: 'Chinese',
                        learningType: 'TANDEM',
                        level: 'A0',
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
                user: userResult,
            },
        },
        userLearningLanguage: {
            id: 'id',
            code: 'EN',
            name: 'English',
            level: 'A1',
            learningType: 'ETANDEM',
        },
    },
];

describe('getAllTandems', () => {
    let adapter: DomainHttpAdapter;
    let usecase: GetAllTandemsUsecase;
    beforeAll(() => {
        adapter = new DomainHttpAdapter();
        usecase = new GetAllTandemsUsecase(adapter);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('execute function must call DomainHttpAdapter with specific path and params', async () => {
        expect.assertions(2);
        jest.spyOn(adapter, 'get');
        adapter.mockJson({ parsedBody: httpCallResponse });
        await usecase.execute('id');
        expect(adapter.get).toHaveBeenCalledTimes(1);
        expect(adapter.get).toHaveBeenCalledWith('/profiles/id/tandems');
    });

    it('execute must return an expected response', async () => {
        expect.assertions(1);

        adapter.mockJson({ parsedBody: httpCallResponse });

        const result = (await usecase.execute('id')) as Tandem[];
        expect(result).toHaveLength(1);
    });

    it('execute must return an expected response without parsed body', async () => {
        expect.assertions(1);

        adapter.mockJson({});

        const result = await usecase.execute('id');
        expect(result).toBeInstanceOf(Error);
    });

    it('execute must return an error if adapter return an error without status', async () => {
        expect.assertions(1);
        adapter.mockError({});
        const result = await usecase.execute('id');
        expect(result).toStrictEqual(new Error('errors.global'));
    });
});
