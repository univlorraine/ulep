import { userResultToDomain } from '../../../src/command/UserResult';
import UpdateNotificationPermissionUsecase from '../../../src/domain/usecases/UpdateNotificationPermissionUsecase';
import userResult from '../../fixtures/user';
import DomainHttpAdapter from '../../mocks/adapters/HttpAdapter';

describe('updateNotificationPermission', () => {
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
        jest.spyOn(adapter, 'patch');
        adapter.mockJson({ parsedBody: {} });
        await usecase.execute('id', false);
        expect(adapter.patch).toHaveBeenCalledTimes(1);
        expect(adapter.patch).toHaveBeenCalledWith('/users/id', { acceptsEmail: false });
    });

    it('execute must return an expected response', async () => {
        expect.assertions(1);
        adapter.mockJson({ parsedBody: userResult });

        const result = await usecase.execute('id', false);
        expect(result).toEqual(userResultToDomain(userResult));
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
