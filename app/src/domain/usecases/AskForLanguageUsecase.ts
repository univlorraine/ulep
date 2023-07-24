import { HttpAdapterInterface } from '../../adapter/DomainHttpAdapter';
import AskForLanguageUsecaseInterface from '../interfaces/AskForLanguageUsecase.interface';

class AskForLanguageUsecase implements AskForLanguageUsecaseInterface {
    constructor(private readonly domainHttpAdapter: HttpAdapterInterface) {}

    async execute(): Promise<number | Error> {
        try {
            //TODO: CURRENTLY MOCK DATA
            /*const httpRepsonse: HttpResponse<CollectionCommand<CategoryInterestsCommand>> = await this.domainHttpAdapter.post(
                `/interests`
            );

            if (!httpRepsonse.parsedBody || !httpRepsonse.parsedBody.items) {
                return new Error('errors.global');
            }

            return ;
            */

            return 200; // BECAUSE THERE IS 200 PPL ASKING
        } catch (error: any) {
            return new Error('errors.global');
        }
    }
}

export default AskForLanguageUsecase;
