import LanguageCommand, { LanguageAskedCommand } from '../../../src/command/LanguageCommand';
import Language from '../../../src/domain/entities/Language';
import AskForLearningLanguageUsecase from '../../../src/domain/usecases/AskForLearningLanguageUsecase';
import DomainHttpAdapter from '../../mocks/adapters/HttpAdapter';

const usecaseResponse: LanguageCommand = { id: 'id', code: 'FR', name: 'Français' };
const languagePayload = new Language('id', 'FR', 'Français');

describe('askForLearningLanguage', () => {
    let adapter: DomainHttpAdapter;
    let usecase: AskForLearningLanguageUsecase;
    beforeAll(() => {
        adapter = new DomainHttpAdapter();
        usecase = new AskForLearningLanguageUsecase(adapter);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('execute function must call DomainHttpAdapter with specific path and params', async () => {
        expect.assertions(2);
        jest.spyOn(adapter, 'post');
        adapter.mockJson({ parsedBody: usecaseResponse });
        await usecase.execute('id', languagePayload, 'A1');
        expect(adapter.post).toHaveBeenCalledTimes(1);
        expect(adapter.post).toHaveBeenCalledWith(`/profiles/id/learning-language`, { code: 'FR', level: 'A1' });
    });

    it('execute must return an expected response', async () => {
        expect.assertions(1);

        adapter.mockJson({ parsedBody: usecaseResponse });

        const result = await usecase.execute('id', languagePayload, 'A1');
        expect(result).toStrictEqual(new Language('id', 'FR', 'Français'));
    });

    it('execute must return an expected response without parsed body', async () => {
        expect.assertions(1);

        adapter.mockJson({});

        const result = await usecase.execute('id', languagePayload, 'A1');
        expect(result).toBeInstanceOf(Error);
    });

    it('execute 409 response without parsed body', async () => {
        expect.assertions(1);

        adapter.mockError({ status: 409 });

        const result = await usecase.execute('id', languagePayload, 'A1');
        expect(result).toBeInstanceOf(Error);
    });

    it('execute must return an error if adapter return an error without status', async () => {
        expect.assertions(1);
        adapter.mockError({});
        const result = await usecase.execute('id', languagePayload, 'A1');
        expect(result).toStrictEqual(new Error('errors.global'));
    });
});
