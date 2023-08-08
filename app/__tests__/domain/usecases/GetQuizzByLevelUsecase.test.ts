import { CollectionCommand } from '../../../src/command/CollectionCommand';
import QuestionCommand from '../../../src/command/QuestionCommand';
import Question from '../../../src/domain/entities/Question';
import GetQuizzByLevelUsecase from '../../../src/domain/usecases/GetQuizzByLevelUsecase';
import DomainHttpAdapter from '../../mocks/adapters/HttpAdapter';

const usecaseResponse: QuestionCommand[] = [
    { question: 'question', answer: true },
    { question: 'question2', answer: true },
];

describe('getQuizzByLevel', () => {
    let adapter: DomainHttpAdapter;
    let usecase: GetQuizzByLevelUsecase;
    beforeAll(() => {
        adapter = new DomainHttpAdapter();
        usecase = new GetQuizzByLevelUsecase(adapter);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('execute function must call DomainHttpAdapter with specific path and params', async () => {
        expect.assertions(2);
        jest.spyOn(adapter, 'get');
        adapter.mockJson({ parsedBody: usecaseResponse });
        await usecase.execute('A1');
        expect(adapter.get).toHaveBeenCalledTimes(1);
        expect(adapter.get).toHaveBeenCalledWith('/proficiency/questions/A1');
    });

    it('execute must return an expected response', async () => {
        expect.assertions(1);

        adapter.mockJson({ parsedBody: usecaseResponse });

        const result = (await usecase.execute('A1')) as Question[];
        expect(result).toHaveLength(2);
    });

    it('execute must return an expected response without parsed body', async () => {
        expect.assertions(1);

        adapter.mockJson({});

        const result = await usecase.execute('A1');
        expect(result).toBeInstanceOf(Error);
    });

    it('execute must return an error if adapter return an error without status', async () => {
        expect.assertions(1);
        adapter.mockError({});
        const result = await usecase.execute('A0');
        expect(result).toStrictEqual(new Error('errors.global'));
    });
});
