import MediaObject from '../../../src/domain/entities/MediaObject';
import UpdateAvatarUsecase from '../../../src/domain/usecases/UpdateAvatarUsecase';
import DomainHttpAdapter from '../../mocks/adapters/HttpAdapter';

const response = { id: 'id', mimeType: "image/png", url: 'url' };

const file = new File(['Bits'], 'name');

describe('updateAvatar', () => {
    let adapter: DomainHttpAdapter;
    let usecase: UpdateAvatarUsecase;
    beforeAll(() => {
        adapter = new DomainHttpAdapter();
        usecase = new UpdateAvatarUsecase(adapter);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('execute function must call DomainHttpAdapter with specific path and params', async () => {
        expect.assertions(2);
        jest.spyOn(adapter, 'post');
        adapter.mockJson({ parsedBody: {} });
        await usecase.execute(file);
        expect(adapter.post).toHaveBeenCalledTimes(1);
        expect(adapter.post).toHaveBeenCalledWith('/uploads/avatar', { file }, {}, 'multipart/form-data');
    });

    it('execute must return an expected response', async () => {
        expect.assertions(3);

        adapter.mockJson({ parsedBody: response });

        const result = await usecase.execute(file);
        expect(result).toHaveProperty('id');
        expect(result).toHaveProperty('mimeType');
        expect(result).toHaveProperty('url');
        // expect(result).toBeInstanceOf(MediaObject);
    });

    it('execute must return an expected response without parsed body', async () => {
        expect.assertions(1);

        adapter.mockJson({});

        const result = await usecase.execute(file);
        expect(result).toBeInstanceOf(Error);
    });

    it('execute must return an error if adapter return an error without status', async () => {
        expect.assertions(1);
        adapter.mockError({});
        const result = await usecase.execute(file);
        expect(result).toStrictEqual(new Error('errors.global'));
    });
});
