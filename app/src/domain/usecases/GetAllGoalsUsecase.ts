import { HttpAdapterInterface } from '../../adapter/DomainHttpAdapter';
import Goal from '../entities/Goal';
import GetAllGoalsUsecaseInterface from '../interfaces/GetAllGoalsUsecase.interface';

class GetAllGoalsUsecase implements GetAllGoalsUsecaseInterface {
    constructor(private readonly domainHttpAdapter: HttpAdapterInterface) {}

    async execute(): Promise<Goal[] | Error> {
        try {
            //TODO: CURRENTLY MOCK DATA
            /*const httpRepsonse: HttpResponse<CollectionCommand<GoalCommand>> = await this.domainHttpAdapter.get(
                `/goals`
            );

            if (!httpRepsonse.parsedBody || !httpRepsonse.parsedBody.items) {
                return new Error('errors.global');
            }

            return httpRepsonse.parsedBody.items.map((goal) => goalCommandToDomain(goal));
            */

            return [
                new Goal('1', '/assets/group_conversation.svg', 'Découvrir une nouvelle langue'),
                new Goal('2', '/assets/pin.svg', 'Découvrir une culture'),
                new Goal('3', '/assets/oral_skill.svg', 'Améliorer mes compétences orales'),
                new Goal('4', '/assets/writing_skill.svg', 'Améliorer mes compétences écrites'),
                new Goal('5', '/assets/trophie.svg', 'Obtenir un certificat (e)Tandem'),
            ];
        } catch (error: any) {
            return new Error('errors.global');
        }
    }
}

export default GetAllGoalsUsecase;
