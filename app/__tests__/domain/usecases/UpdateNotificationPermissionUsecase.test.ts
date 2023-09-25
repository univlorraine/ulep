import UpdateNotificationPermissionUsecase from '../../../src/domain/usecases/UpdateNotificationPermissionUsecase';
import DomainHttpAdapter from '../../mocks/adapters/HttpAdapter';
describe('updateAvatar', () => {
    let adapter: DomainHttpAdapter;
    let usecase: UpdateNotificationPermissionUsecase;
    beforeAll(() => {
        adapter = new DomainHttpAdapter();
        usecase = new UpdateNotificationPermissionUsecase(adapter);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('execute function must call DomainHttpAdapter with specific path and params', async () => {
        expect.assertions(2);
        jest.spyOn(adapter, 'put');
        adapter.mockJson({ parsedBody: {} });
        await usecase.execute('id', false);
        expect(adapter.put).toHaveBeenCalledTimes(1);
        expect(adapter.put).toHaveBeenCalledWith('/users', { id: 'id', acceptsEmail: false });
    });

    it('execute must return an expected response', async () => {
        expect.assertions(1);

        adapter.mockJson({ parsedBody: {} });

        const result = await usecase.execute('id', false);
        expect(result).toBeUndefined();
    });

    it('execute must return an expected response without parsed body', async () => {
        expect.assertions(1);

        adapter.mockJson({});

        const result = await usecase.execute('id', false);
        expect(result).toBeInstanceOf(Error);
    });

    it('execute must return an error if adapter return an error without status', async () => {
        expect.assertions(1);
        adapter.mockError({});
        const result = await usecase.execute('id', false);
        expect(result).toStrictEqual(new Error('errors.global'));
    });
});
