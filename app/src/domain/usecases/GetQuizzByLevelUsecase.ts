import { HttpAdapterInterface } from '../../adapter/DomainHttpAdapter';
import Question from '../entities/Question';
import GetQuizzByLevelUsecaseInterface from '../interfaces/GetQuizzByLevelUsecase.interface';

const mockedQuestions = [
    new Question(
        'Je peux reconnaître une information concrète à propos d’un sujet familier et quotidien, à condition que le débit soit lent et que l’information soit claire.',
        true
    ),
    new Question(
        'Je peux reconnaître des mots ou des expressions familiers et identifier les sujets dans les gros titres et les résumés des nouvelles ainsi que la plupart des produits dans les publicités, en utilisant les informations visuelles.',
        true
    ),
    new Question(
        'Je peux participer à une conversation simple de nature factuelle et sur un sujet prévisible (par ex. sur son logement, son pays, sa famille, ses études).',
        true
    ),
    new Question('Je peux demander à quelqu’un de ses nouvelles et y réagir.', true),
    new Question(
        'Je peux échanger sur mes goûts pour le sport, la nourriture, etc. en utilisant un répertoire limité d’expressions et à condition qu’on s’adresse directement à moi clairement et lentement.',
        true
    ),
];

class GetQuizzByLevelUsecase implements GetQuizzByLevelUsecaseInterface {
    constructor(private readonly domainHttpAdapter: HttpAdapterInterface) {}
    //TODO: remove mocked data
    async execute(level: string): Promise<Question[] | Error> {
        try {
            /*const httpRepsonse: HttpResponse<CollectionCommand<UniversityCommand>> = await this.domainHttpAdapter.get(
                `/universities`
            );

            if (!httpRepsonse.parsedBody || !httpRepsonse.parsedBody.items) {
                return new Error('errors.global');
            }

            return httpRepsonse.parsedBody.items.map((university) => universityCommandToDomain(university));*/
            return mockedQuestions;
        } catch (error: any) {
            return new Error('errors.global');
        }
    }
}

export default GetQuizzByLevelUsecase;
