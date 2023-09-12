import { CollectionCommand } from '../../../src/command/CollectionCommand';
import LanguageCommand from '../../../src/command/LanguageCommand';
import Language from '../../../src/domain/entities/Language';
import GetAllLanguagesUsecase from '../../../src/domain/usecases/GetAllLanguagesUsecase';
import DomainHttpAdapter from '../../mocks/adapters/HttpAdapter';

const usecaseResponse: CollectionCommand<LanguageCommand> = {
    items: [{ id: 'ID', code: 'code', name: 'name' }],
    totalItems: 1,
};

describe('getAllLanguages', () => {
    let adapter: DomainHttpAdapter;
    let usecase: GetAllLanguagesUsecase;
    beforeAll(() => {
        adapter = new DomainHttpAdapter();
        usecase = new GetAllLanguagesUsecase(adapter);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('execute function must call DomainHttpAdapter with specific path and params', async () => {
        expect.assertions(2);
        jest.spyOn(adapter, 'get');
        adapter.mockJson({ parsedBody: usecaseResponse });
        await usecase.execute();
        expect(adapter.get).toHaveBeenCalledTimes(1);
        expect(adapter.get).toHaveBeenCalledWith('/languages?pagination=false&field=name&order=asc');
    });

    it('execute function must call DomainHttpAdapter with universityId', async () => {
        expect.assertions(2);
        jest.spyOn(adapter, 'get');
        adapter.mockJson({ parsedBody: usecaseResponse });
        await usecase.execute('status');
        expect(adapter.get).toHaveBeenCalledTimes(1);
        expect(adapter.get).toHaveBeenCalledWith('/languages?status=status&pagination=false&field=name&order=asc');
    });

    it('execute must return an expected response', async () => {
        expect.assertions(1);

        adapter.mockJson({ parsedBody: usecaseResponse });

        const result = (await usecase.execute()) as Language[];
        expect(result).toHaveLength(1);
    });

    it('execute must return an expected response without parsed body', async () => {
        expect.assertions(1);

        adapter.mockJson({});

        const result = await usecase.execute();
        expect(result).toBeInstanceOf(Error);
    });

    it('execute must return an error if adapter return an error without status', async () => {
        expect.assertions(1);
        adapter.mockError({});
        const result = await usecase.execute();
        expect(result).toStrictEqual(new Error('errors.global'));
    });
});
