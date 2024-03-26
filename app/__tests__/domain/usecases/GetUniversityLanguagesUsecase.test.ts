import LanguageCommand from '../../../src/command/LanguageCommand';
import Language from '../../../src/domain/entities/Language';
import GetUniversityLanguagesUsecase from '../../../src/domain/usecases/GetUniversityLanguagesUsecase';
import DomainHttpAdapter from '../../mocks/adapters/HttpAdapter';

const usecaseResponse: LanguageCommand[] = [
    { id: 'id', code: 'code', name: 'name' },
    { id: 'id2', code: 'code2', name: 'name2' },
];

describe('getUniversityLanguages', () => {
    let adapter: DomainHttpAdapter;
    let usecase: GetUniversityLanguagesUsecase;
    beforeAll(() => {
        adapter = new DomainHttpAdapter();
        usecase = new GetUniversityLanguagesUsecase(adapter);
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
        expect(adapter.get).toHaveBeenCalledWith('/universities/id/languages');
    });

    it('execute must return an expected response', async () => {
        expect.assertions(1);

        adapter.mockJson({ parsedBody: usecaseResponse });

        const result = (await usecase.execute('id')) as Language[];
        expect(result).toHaveLength(2);
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
