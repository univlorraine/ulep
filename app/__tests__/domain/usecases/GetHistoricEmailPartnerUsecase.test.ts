import GetHistoricEmailPartnerUsecase from '../../../src/domain/usecases/GetHistoricEmailPartnerUsecase';
import DomainHttpAdapter from '../../mocks/adapters/HttpAdapter';

const email = 'myemail@email.com';
const httpCallResponse: { email: string } = { email };
const userId = 'userId';
const languageId = 'languageId';

describe('getHistoricEmailPartner', () => {
    let adapter: DomainHttpAdapter;
    let usecase: GetHistoricEmailPartnerUsecase;
    beforeAll(() => {
        adapter = new DomainHttpAdapter();
        usecase = new GetHistoricEmailPartnerUsecase(adapter);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('execute function must call DomainHttpAdapter with specific path and params', async () => {
        expect.assertions(2);
        jest.spyOn(adapter, 'get');
        adapter.mockJson({ parsedBody: httpCallResponse });
        await usecase.execute(userId, languageId);
        expect(adapter.get).toHaveBeenCalledTimes(1);
        expect(adapter.get).toHaveBeenCalledWith(
            `/tandem-history/partner-email?userId=${userId}&languageId=${languageId}`
        );
    });

    it('execute must return an expected response', async () => {
        expect.assertions(1);

        adapter.mockJson({ parsedBody: httpCallResponse });

        const result = await usecase.execute(userId, languageId);
        expect(result).toBe(email);
    });

    it('execute must return an expected response without parsed body', async () => {
        expect.assertions(1);

        adapter.mockJson({});

        const result = await usecase.execute(userId, languageId);
        expect(result).toBeUndefined();
    });

    it('execute must return an error if adapter return an error without status', async () => {
        expect.assertions(1);
        adapter.mockError({});
        const result = await usecase.execute(userId, languageId);
        expect(result).toBeUndefined();
    });
});
