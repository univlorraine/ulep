import { CollectionCommand } from '../../../src/command/CollectionCommand';
import UniversityCommand from '../../../src/command/UniversityCommand';
import University from '../../../src/domain/entities/University';
import GetPartnersToUniversityUsecase from '../../../src/domain/usecases/GetPartnersToUniversityUsecase';
import DomainHttpAdapter from '../../mocks/adapters/HttpAdapter';

const universityId = 'id';
const httpCallResponse: CollectionCommand<UniversityCommand> = {
    items: [
        {
            id: 'id',
            name: 'name',
            sites: [
                { id: 'id', name: 'Campus A' },
                { id: 'id2', name: 'Campus B' },
            ],
            hasCode: true,
            isCodeMandatory: true,
            parent: undefined,
            timezone: 'timezone',
            website: 'website',
            admissionStart: new Date('2023-01-01T00:00:00.000Z'),
            admissionEnd: new Date('2023-12-31T00:00:00.000Z'),
            openServiceDate: new Date('2023-01-01T00:00:00.000Z'),
            closeServiceDate: new Date('2023-01-01T00:00:00.000Z'),
            maxTandemsPerUser: 3,
        },
    ],
    totalItems: 1,
};

describe('GetPartnersToUniversity', () => {
    let adapter: DomainHttpAdapter;
    let usecase: GetPartnersToUniversityUsecase;
    beforeAll(() => {
        adapter = new DomainHttpAdapter();
        usecase = new GetPartnersToUniversityUsecase(adapter);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('execute function must call DomainHttpAdapter with specific path and params', async () => {
        expect.assertions(2);
        jest.spyOn(adapter, 'get');
        adapter.mockJson({ parsedBody: httpCallResponse });
        await usecase.execute(universityId);
        expect(adapter.get).toHaveBeenCalledTimes(1);
        expect(adapter.get).toHaveBeenCalledWith('/universities/id/partners');
    });

    it('execute must return an expected response', async () => {
        expect.assertions(1);

        adapter.mockJson({ parsedBody: httpCallResponse });

        const result = (await usecase.execute(universityId)) as University[];
        expect(result).toHaveLength(1);
    });

    it('execute must return an expected response without parsed body', async () => {
        expect.assertions(1);

        adapter.mockJson({});

        const result = await usecase.execute(universityId);
        expect(result).toBeInstanceOf(Error);
    });

    it('execute must return an error if adapter return an error without status', async () => {
        expect.assertions(1);
        adapter.mockError({});
        const result = await usecase.execute(universityId);
        expect(result).toStrictEqual(new Error('errors.global'));
    });
});
