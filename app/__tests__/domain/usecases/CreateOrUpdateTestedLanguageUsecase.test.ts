/**
 *
 *   Copyright ou © ou Copr. Université de Lorraine, (2025)
 *
 *   Direction du Numérique de l'Université de Lorraine - SIED
 *
 *   Ce logiciel est un programme informatique servant à rendre accessible
 *   sur mobile et sur internet l'application ULEP (University Language
 *   Exchange Programme) aux étudiants et aux personnels des universités
 *   parties prenantes.
 *
 *   Ce logiciel est régi par la licence CeCILL 2.1, soumise au droit français
 *   et respectant les principes de diffusion des logiciels libres. Vous pouvez
 *   utiliser, modifier et/ou redistribuer ce programme sous les conditions
 *   de la licence CeCILL telle que diffusée par le CEA, le CNRS et INRIA
 *   sur le site "http://cecill.info".
 *
 *   En contrepartie de l'accessibilité au code source et des droits de copie,
 *   de modification et de redistribution accordés par cette licence, il n'est
 *   offert aux utilisateurs qu'une garantie limitée. Pour les mêmes raisons,
 *   seule une responsabilité restreinte pèse sur l'auteur du programme, le
 *   titulaire des droits patrimoniaux et les concédants successifs.
 *
 *   À cet égard, l'attention de l'utilisateur est attirée sur les risques
 *   associés au chargement, à l'utilisation, à la modification et/ou au
 *   développement et à la reproduction du logiciel par l'utilisateur étant
 *   donné sa spécificité de logiciel libre, qui peut le rendre complexe à
 *   manipuler et qui le réserve donc à des développeurs et des professionnels
 *   avertis possédant des connaissances informatiques approfondies. Les
 *   utilisateurs sont donc invités à charger et à tester l'adéquation du
 *   logiciel à leurs besoins dans des conditions permettant d'assurer la
 *   sécurité de leurs systèmes et/ou de leurs données et, plus généralement,
 *   à l'utiliser et à l'exploiter dans les mêmes conditions de sécurité.
 *
 *   Le fait que vous puissiez accéder à cet en-tête signifie que vous avez
 *   pris connaissance de la licence CeCILL 2.1, et que vous en avez accepté les
 *   termes.
 *
 */

import ProfileCommand from '../../../src/command/ProfileCommand';
import Language from '../../../src/domain/entities/Language';
import CreateOrUpdateTestedLanguageUsecase from '../../../src/domain/usecases/CreateOrUpdateTestedLanguageUsecase';
import userResult from '../../fixtures/user';
import DomainHttpAdapter from '../../mocks/adapters/HttpAdapter';

const language = new Language('fr', 'fr', 'French');

const payload: ProfileCommand = {
    id: 'id',
    interests: [{ id: 'interestId', name: 'name' }],
    nativeLanguage: {
        code: 'FR',
        name: 'Français',
    },
    masteredLanguages: [{ code: 'EN', name: 'English' }],
    testedLanguages: [{ code: 'FR', name: 'French', level: 'A1' }],
    learningLanguages: [],
    objectives: [{ id: 'id', name: 'name', image: { id: 'id', mimeType: 'image/jpg' } }],
    meetingFrequency: 'ONCE_A_WEEK',
    biography: {
        anecdote: 'anecdote',
        experience: 'experience',
        favoritePlace: 'place',
        superpower: 'power',
    },
    availabilities: {
        monday: 'AVAILABLE',
        tuesday: 'AVAILABLE',
        wednesday: 'AVAILABLE',
        thursday: 'AVAILABLE',
        friday: 'AVAILABLE',
        saturday: 'AVAILABLE',
        sunday: 'AVAILABLE',
    },
    availabilitiesNote: 'note',
    user: userResult,
};

describe('createOrUpdateTestedLanguage', () => {
    let adapter: DomainHttpAdapter;
    let mockedSetProfile: Function;
    let usecase: CreateOrUpdateTestedLanguageUsecase;
    beforeAll(() => {
        adapter = new DomainHttpAdapter();
        mockedSetProfile = jest.fn();
        usecase = new CreateOrUpdateTestedLanguageUsecase(adapter, mockedSetProfile);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('execute function must call DomainHttpAdapter with specific path and params', async () => {
        expect.assertions(2);
        jest.spyOn(adapter, 'post');
        adapter.mockJson({ parsedBody: {} });
        await usecase.execute('id', language, 'A1');
        expect(adapter.post).toHaveBeenCalledTimes(1);
        expect(adapter.post).toHaveBeenCalledWith('/profiles/id/tested-language', {
            code: 'fr',
            level: 'A1',
        });
    });

    it('execute must return an expected response', async () => {
        expect.assertions(2);

        adapter.mockJson({ parsedBody: payload });

        const result = await usecase.execute('id', language, 'A1');

        expect(mockedSetProfile).toHaveBeenCalledTimes(1);
        expect(result).toBeUndefined();
    });

    it('execute must return an expected response without parsed body', async () => {
        expect.assertions(1);

        adapter.mockJson({});

        const result = await usecase.execute('id', language, 'A1');

        expect(result).toBeInstanceOf(Error);
    });

    it('execute must return an error if adapter return an error without status', async () => {
        expect.assertions(1);
        adapter.mockError({});
        const result = await usecase.execute('id', language, 'A1');

        expect(result).toStrictEqual(new Error('errors.global'));
    });
});
