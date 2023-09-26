import { LanguageAskedCommand } from '../../../src/command/LanguageCommand';
import Language from '../../../src/domain/entities/Language';
import AskForLanguageUsecase from '../../../src/domain/usecases/AskForLanguageUsecase';
import DomainHttpAdapter from '../../mocks/adapters/HttpAdapter';

const usecaseResponse: LanguageAskedCommand = { code: 'FR', count: 10 };
const languagePayload = new Language('id', 'FR', 'Français');

describe('askForLanguage', () => {
    let adapter: DomainHttpAdapter;
    let usecase: AskForLanguageUsecase;
    beforeAll(() => {
        adapter = new DomainHttpAdapter();
        usecase = new AskForLanguageUsecase(adapter);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('execute function must call DomainHttpAdapter with specific path and params', async () => {
        expect.assertions(2);
        jest.spyOn(adapter, 'post');
        adapter.mockJson({ parsedBody: usecaseResponse });
        await usecase.execute(languagePayload);
        expect(adapter.post).toHaveBeenCalledTimes(1);
        expect(adapter.post).toHaveBeenCalledWith(`/languages/${languagePayload.code}/requests`, {});
    });

    it('execute must return an expected response', async () => {
        expect.assertions(1);

        adapter.mockJson({ parsedBody: usecaseResponse });

        const result = await usecase.execute(languagePayload);
        expect(result).toBe(10);
    });

    it('execute must return an expected response without parsed body', async () => {
        expect.assertions(1);

        adapter.mockJson({});

        const result = await usecase.execute(languagePayload);
        expect(result).toBeInstanceOf(Error);
    });

    it('execute 409 response without parsed body', async () => {
        expect.assertions(1);

        adapter.mockError({ status: 409 });

        const result = await usecase.execute(languagePayload);
        expect(result).toBeInstanceOf(Error);
    });

    it('execute must return an error if adapter return an error without status', async () => {
        expect.assertions(1);
        adapter.mockError({});
        const result = await usecase.execute(languagePayload);
        expect(result).toStrictEqual(new Error('errors.global'));
    });
});
