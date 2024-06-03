import AddDeviceUsecase from '../../../src/domain/usecases/AddDeviceUsecase';
import DomainHttpAdapter from '../../mocks/adapters/HttpAdapter';

const token = 'token';

describe('addDevice', () => {
    let adapter: DomainHttpAdapter;
    let usecase: AddDeviceUsecase;
    beforeAll(() => {
        adapter = new DomainHttpAdapter();
        usecase = new AddDeviceUsecase(adapter);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('execute function must call DomainHttpAdapter with specific path and params', async () => {
        expect.assertions(2);
        jest.spyOn(adapter, 'post');
        adapter.mockJson({ parsedBody: {} });
        await usecase.execute(token, true, false);
        expect(adapter.post).toHaveBeenCalledTimes(1);
        expect(adapter.post).toHaveBeenCalledWith(`/users/add-device`, { token, isAndroid: true, isIos: false });
    });

    it('execute must return an expected response without parsed body', async () => {
        expect.assertions(1);

        adapter.mockJson({});

        const result = await usecase.execute(token, true, false);
        expect(result).toBeInstanceOf(Error);
    });

    it('execute 409 response without parsed body', async () => {
        expect.assertions(1);

        adapter.mockError({ status: 409 });

        const result = await usecase.execute(token, true, false);
        expect(result).toBeInstanceOf(Error);
    });

    it('execute must return an error if adapter return an error without status', async () => {
        expect.assertions(1);
        adapter.mockError({});
        const result = await usecase.execute(token, true, false);
        expect(result).toStrictEqual(new Error('errors.global'));
    });
});
