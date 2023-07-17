import { HttpAdapterInterface } from '../../adapter/DomainHttpAdapter';
import CategoryInterests from '../entities/CategoryInterests';
import GetAllCategoriesInterestsUsecaseInterface from '../interfaces/GetAllCategoriesInterestsUsecase.interface';

class GetAllCategoriesInterestssUsecase implements GetAllCategoriesInterestsUsecaseInterface {
    constructor(private readonly domainHttpAdapter: HttpAdapterInterface) {}

    async execute(): Promise<CategoryInterests[] | Error> {
        try {
            //TODO: CURRENTLY MOCK DATA
            /*const httpRepsonse: HttpResponse<CollectionCommand<CategoryInterestsCommand>> = await this.domainHttpAdapter.get(
                `/interests`
            );

            if (!httpRepsonse.parsedBody || !httpRepsonse.parsedBody.items) {
                return new Error('errors.global');
            }

            return httpRepsonse.parsedBody.items.map((goal) => goalCommandToDomain(goal));
            */

            return [
                new CategoryInterests('1', 'Sports', [
                    'Surf',
                    'Rando',
                    'Running',
                    'Velo',
                    'Danse',
                    'Musculation',
                    'Football',
                    'Basketball',
                    'Rugby',
                    'Tennis',
                    'Volleyball',
                    'Natation',
                    'Yoga',
                    'Randonnée',
                    'BMX',
                    'Equitation',
                ]),
                new CategoryInterests('2', 'Ciné / séries', [
                    'Action',
                    'Romance',
                    'Drame',
                    'Comédie',
                    'Horreur',
                    'Thriller',
                    'SF',
                    'Policier',
                    'Documentaire',
                    'Fantaisie',
                ]),
                new CategoryInterests('3', 'Voyage', [
                    'Place',
                    'Montage',
                    'Ville',
                    'Chaleur',
                    'Froid',
                    'Gastronomie',
                    'Seul.e',
                    'À plusieurs',
                ]),
                new CategoryInterests('4', 'Musique', [
                    'Rap',
                    'R&B',
                    'Classique',
                    'Pop',
                    'Jazz',
                    'Electro',
                    'Rock',
                    'Musique latine',
                ]),
                new CategoryInterests('5', 'Loisirs', [
                    'Couture',
                    'Jeux vidéos',
                    'Chant',
                    'Bricolage',
                    'Théatre',
                    'Jeux de société',
                    'Cuisine',
                    'Photographie',
                    'Dessin/peinture',
                    'Ecriture',
                    'Lecture',
                    'Jardinage',
                    'Sorties culturelles',
                    'Bénévolat',
                ]),
                new CategoryInterests('6', "Domaines d'intêréts", [
                    'Arts',
                    'Psychologie',
                    'Histoire',
                    'Langues étrangères',
                    'Mode',
                    'Informatique',
                    'Sciences',
                ]),
            ];
        } catch (error: any) {
            return new Error('errors.global');
        }
    }
}

export default GetAllCategoriesInterestssUsecase;
