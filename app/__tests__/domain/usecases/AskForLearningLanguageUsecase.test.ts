import { LearningLanguageResult } from '../../../src/command/LearningLanguageResult';
import Language from '../../../src/domain/entities/Language';
import LearningLanguage from '../../../src/domain/entities/LearningLanguage';
import AskForLearningLanguageUsecase from '../../../src/domain/usecases/AskForLearningLanguageUsecase';
import DomainHttpAdapter from '../../mocks/adapters/HttpAdapter';

const httpCallResponse: LearningLanguageResult = {
    id: 'id',
    code: 'FR',
    name: 'Français',
    learningType: 'TANDEM',
    level: 'A1',
    sameAge: true,
    sameGender: true,
    certificateOption: false,
    specificProgram: false,
};
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
        adapter.mockJson({ parsedBody: httpCallResponse });
        await usecase.execute('id', languagePayload, 'A1', 'TANDEM', true, true);
        expect(adapter.post).toHaveBeenCalledTimes(1);
        expect(adapter.post).toHaveBeenCalledWith(`/profiles/id/learning-language`, {
            code: 'FR',
            level: 'A1',
            campusId: undefined,
            certificateOption: undefined,
            specificProgram: undefined,
            sameAge: true,
            sameGender: true,
            learningType: 'TANDEM',
        });
    });

    it('execute must return an expected response', async () => {
        expect.assertions(1);

        adapter.mockJson({ parsedBody: httpCallResponse });

        const result = await usecase.execute('id', languagePayload, 'A1', 'TANDEM', true, true);
        expect(result).toStrictEqual(
            new LearningLanguage('id', 'FR', 'Français', 'A1', 'TANDEM', true, true, false, false)
        );
    });

    it('execute must return an expected response without parsed body', async () => {
        expect.assertions(1);

        adapter.mockJson({});

        const result = await usecase.execute('id', languagePayload, 'A1', 'TANDEM', true, true);
        expect(result).toBeInstanceOf(Error);
    });

    it('execute 409 response without parsed body', async () => {
        expect.assertions(1);

        adapter.mockError({ status: 409 });

        const result = await usecase.execute('id', languagePayload, 'A1', 'TANDEM', true, true);
        expect(result).toBeInstanceOf(Error);
    });

    it('execute must return an error if adapter return an error without status', async () => {
        expect.assertions(1);
        adapter.mockError({});
        const result = await usecase.execute('id', languagePayload, 'A1', 'TANDEM', true, true);
        expect(result).toStrictEqual(new Error('errors.global'));
    });
});
