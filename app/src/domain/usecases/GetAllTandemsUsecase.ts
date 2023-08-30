import { HttpAdapterInterface } from '../../adapter/DomainHttpAdapter';
import { AvatarPng } from '../../assets';
import { Interest } from '../entities/CategoryInterests';
import Goal from '../entities/Goal';
import Language from '../entities/Language';
import Profile from '../entities/Profile';
import Tandem from '../entities/Tandem';
import University from '../entities/University';
import User from '../entities/User';
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
            return [
                new Tandem(
                    'id2',
                    new Language('id', 'FR', '🇫🇷 Fraçais'),
                    'ACTIVE',
                    new Profile(
                        'id2',
                        'FR',
                        'CN',
                        [new Goal('id', 'name', '')],
                        'ONCE_A_WEEK',
                        [new Interest('id', 'name')],
                        {
                            anecdote: 'anectdote',
                            experience: 'exeperience',
                            favoritePlace: 'favoritePlace',
                            superpower: 'superpower',
                        },
                        new User(
                            'id2',
                            AvatarPng,
                            'email@test.fr',
                            'firstname',
                            'lastname',
                            new University('id', 'university', true, 'timezone', []),
                            'ACTIVE'
                        )
                    )
                ),
                new Tandem('id3', new Language('id', 'CN', '🇨🇳 Chinois'), 'DRAFT'),
                new Tandem(
                    'id4',
                    new Language('id', 'CN', '🇨🇳 Chinois'),
                    'UNACTIVE',
                    new Profile(
                        'id2',
                        'FR',
                        'CN',
                        [new Goal('id', 'name', '')],
                        'ONCE_A_WEEK',
                        [new Interest('id', 'name')],
                        {
                            anecdote: 'anectdote',
                            experience: 'exeperience',
                            favoritePlace: 'favoritePlace',
                            superpower: 'superpower',
                        },
                        new User(
                            'id2',
                            AvatarPng,
                            'email@test.fr',
                            'firstname',
                            'lastname',
                            new University('id', 'university', true, 'timezone', []),

                            'ACTIVE'
                        )
                    )
                ),
                new Tandem('id5', new Language('id', 'CN', '🇨🇳 Chinois'), 'UNACTIVE'),
            ];
        } catch (error: any) {
            return new Error('errors.global');
        }
    }
}

export default GetAllTandemsUsecase;
