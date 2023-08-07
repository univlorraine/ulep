import { HttpAdapterInterface } from '../../adapter/DomainHttpAdapter';
import Language from '../entities/Language';
import Profile from '../entities/Profile';
import Tandem from '../entities/Tandem';
import GetAllTandemsUsecaseInterface from '../interfaces/GetAllTandemsUsecase.interface';

// TODO(herve): Add profile id command
// response will be like this:
// {
//     "id": "id",
//     "partner": Profile,
//     "languages": Language[],
//     "status": "ACTIVE"
// }
class GetAllTandemsUsecase implements GetAllTandemsUsecaseInterface {
    constructor(private readonly domainHttpAdapter: HttpAdapterInterface) {}

    async execute(): Promise<Tandem[] | Error> {
        try {
            //TODO: replace mocked data when api will be ready
            /*
            const httpResponse: HttpResponse<CollectionCommand<TandemCommand>> = await this.domainHttpAdapter.get(
                `/profiles/{id}/tandems`
            );

            if (!httpResponse.parsedBody || !httpResponse.parsedBody.items) {
                return new Error('errors.global');
            }

            return tandemCommandToDomain(httpResponse.parsedBody.items);*/
            return [];
        } catch (error: any) {
            return new Error('errors.global');
        }
    }
}

export default GetAllTandemsUsecase;
