import { HttpAdapterInterface } from '../../adapter/DomainHttpAdapter';
import Language from '../entities/Language';
import Profile from '../entities/Profile';
import Tandem from '../entities/Tandem';
import GetAllTandemsUsecaseInterface from '../interfaces/GetAllTandemsUsecase.interface';

class GetAllTandemsUsecase implements GetAllTandemsUsecaseInterface {
    constructor(private readonly domainHttpAdapter: HttpAdapterInterface) {}

    async execute(): Promise<Tandem[] | Error> {
        try {
            //TODO: replace mocked data when api will be ready
            /*
            const httpRepsonse: HttpResponse<CollectionCommand<TandemCommand>> = await this.domainHttpAdapter.get(
                `/tandems`
            );

            if (!httpRepsonse.parsedBody || !httpRepsonse.parsedBody.items) {
                return new Error('errors.global');
            }

            return tandemCommandToDomain(httpRepsonse.parsedBody.items);*/
            return [
                new Tandem(
                    'id2',
                    [
                        new Profile(
                            'id2',
                            'email',
                            'firstname',
                            'lastname',
                            22,
                            'MALE',
                            'id',
                            'STUDENT',
                            'FR',
                            'CN',
                            ['goal'],
                            'ONCE_A_WEEK',
                            ['interest'],
                            ['bios'],
                            '/assets/avatar.svg'
                        ),
                    ],
                    new Language('FR', 'Fraçais'),
                    'ACTIVE'
                ),
                new Tandem('id3', [], new Language('CN', 'Chinois'), 'DRAFT'),
                new Tandem(
                    'id4',
                    [
                        new Profile(
                            'id4',
                            'email',
                            'firstname',
                            'lastname',
                            22,
                            'MALE',
                            'id',
                            'STUDENT',
                            'FR',
                            'CN',
                            ['goal'],
                            'ONCE_A_WEEK',
                            ['interest'],
                            ['bios'],
                            '/assets/avatar.svg'
                        ),
                    ],
                    new Language('CN', 'Chinois'),
                    'UNACTIVE'
                ),
                new Tandem('id5', [], new Language('CN', 'Chinois'), 'UNACTIVE'),
            ];
        } catch (error: any) {
            return new Error('errors.global');
        }
    }
}

export default GetAllTandemsUsecase;
