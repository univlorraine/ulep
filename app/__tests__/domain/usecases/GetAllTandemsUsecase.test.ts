import TandemCommand from '../../../src/command/TandemCommand';
import Tandem from '../../../src/domain/entities/Tandem';
import GetAllTandemsUsecase from '../../../src/domain/usecases/GetAllTandemsUsecase';
import DomainHttpAdapter from '../../mocks/adapters/HttpAdapter';

const usecaseResponse: TandemCommand[] = [
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
                learningLanguages: [
                    {
                        id: 'id',
                        code: 'CN',
                        level: 'AO',
                        name: 'Chinese',
                    },
                ],
                objectives: [{ id: 'id', name: 'name', image: { id: 'id', url: 'url' } }],
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
                        timezone: 'timezone',
                        hasCode: true,
                        website: 'site',
                        admissionStart: new Date('2023-01-01T00:00:00.000Z'),
                        admissionEnd: new Date('2023-12-31T00:00:00.000Z'),
                        openServiceDate: new Date('2023-01-01T00:00:00.000Z'),
                        closeServiceDate: new Date('2023-01-01T00:00:00.000Z'),
                        maxTandemsPerUser: 1,
                    },
                    status: 'ACTIVE',
                },
            },
        },
        userLearningLanguage: {
            id: 'id',
            code: 'EN',
            name: 'English',
            level: 'A1',
            learningType: 'ETANDEM'
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
        adapter.mockJson({ parsedBody: usecaseResponse });
        await usecase.execute('id');
        expect(adapter.get).toHaveBeenCalledTimes(1);
        expect(adapter.get).toHaveBeenCalledWith('/profiles/id/tandems');
    });

    it('execute must return an expected response', async () => {
        expect.assertions(1);

        adapter.mockJson({ parsedBody: usecaseResponse });

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
