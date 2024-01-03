import MediaObject from '../../../src/domain/entities/MediaObject';
import GetMediaObjectUsecase from '../../../src/domain/usecases/GetMediaObjectUsecase';
import DomainHttpAdapter from '../../mocks/adapters/HttpAdapter';

const id = 'id';
const accessToken = 'accessToken';
const response = { id: 'id', mimeType: "image/png", url: 'url' };

describe('getPressignedUrl', () => {
  let adapter: DomainHttpAdapter;
  let usecase: GetMediaObjectUsecase;
  beforeAll(() => {
    adapter = new DomainHttpAdapter();
    usecase = new GetMediaObjectUsecase(adapter);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('execute function must call DomainHttpAdapter with specific path and params', async () => {
    expect.assertions(2);
    jest.spyOn(adapter, 'get');
    adapter.mockJson({ parsedBody: response });
    await usecase.execute(id, accessToken);
    expect(adapter.get).toHaveBeenCalledTimes(1);
    expect(adapter.get).toHaveBeenCalledWith('/uploads/id', {}, false, 'accessToken');
  });

  it('execute must return an expected response', async () => {
    expect.assertions(1);

    adapter.mockJson({ parsedBody: response });

    const result = await usecase.execute(id, accessToken);
    expect(result).toHaveProperty('url');
  });

  it('execute must return an expected response without parsed body', async () => {
    expect.assertions(1);

    adapter.mockJson({});

    const result = await usecase.execute(id, accessToken);
    expect(result).toBeInstanceOf(Error);
  });

  it('execute must return an error if adapter return an error without status', async () => {
    expect.assertions(1);
    adapter.mockError({});
    const result = await usecase.execute(id, accessToken);
    expect(result).toStrictEqual(new Error('errors.global'));
  });
});
