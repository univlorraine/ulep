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

import EditUserUsecaseInterface from '../../../src/domain/interfaces/EditUserUsecase.interface';
import EditUserUsecase from '../../../src/domain/usecases/EditUserUsecase';
import userResult from '../../fixtures/user';
import DomainHttpAdapter from '../../mocks/adapters/HttpAdapter';

const payload = userResult;

const file = new File(['Bits'], 'name');
describe('editUserUsecase', () => {
    let adapter: DomainHttpAdapter;
    let usecase: EditUserUsecaseInterface;
    let mockedSetUser: Function;
    beforeAll(() => {
        adapter = new DomainHttpAdapter();
        mockedSetUser = jest.fn();
        usecase = new EditUserUsecase(adapter, mockedSetUser);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('execute function must call DomainHttpAdapter with specific path and params', async () => {
        expect.assertions(2);
        jest.spyOn(adapter, 'post');
        adapter.mockJson({ parsedBody: payload });
        await usecase.execute('id', 22, 'email', 'firstname', 'MALE', 'lastname', file);
        expect(adapter.post).toHaveBeenCalledTimes(1);
        expect(adapter.post).toHaveBeenCalledWith(
            '/users/id/',
            {
                email: 'email',
                firstname: 'firstname',
                lastname: 'lastname',
                gender: 'MALE',
                age: 22,
                file: file,
            },
            {},
            'multipart/form-data'
        );
    });

    it('execute must return an expected response', async () => {
        expect.assertions(1);

        adapter.mockJson({ parsedBody: payload });

        await usecase.execute('id', 22, 'email', 'firstname', 'MALE', 'lastname', file);
        expect(mockedSetUser).toHaveBeenCalledTimes(1);
    });

    it('execute must return an np payload', async () => {
        expect.assertions(1);
        adapter.mockJson({});
        const result = await usecase.execute('id', 22, 'email', 'firstname', 'MALE', 'lastname', file);

        expect(result).toStrictEqual(new Error('errors.global'));
    });

    it('execute must return an error if adapter return an error', async () => {
        expect.assertions(1);
        adapter.mockError({ status: 407 });
        const result = await usecase.execute('id', 22, 'email', 'firstname', 'MALE', 'lastname', file);

        expect(result).toStrictEqual(new Error('errors.global'));
    });

    it('execute must return an error if adapter return an error without status', async () => {
        expect.assertions(1);
        adapter.mockError({});
        const result = await usecase.execute('id', 22, 'email', 'firstname', 'MALE', 'lastname', file);

        expect(result).toStrictEqual(new Error('errors.global'));
    });

    it('execute must return an error if adapter has unexpected error body', async () => {
        expect.assertions(1);
        adapter.mockError({ error: { statusCode: 500 } });
        const result = await usecase.execute('id', 22, 'email', 'firstname', 'MALE', 'lastname', file);

        expect(result).toStrictEqual(new Error('errors.global'));
    });

    it('execute must return an error if adapter has code 401 ', async () => {
        expect.assertions(1);
        adapter.mockError({ error: { statusCode: 401, message: 'unauthorized' } });
        const result = await usecase.execute('id', 22, 'email', 'firstname', 'MALE', 'lastname', file);

        expect(result).toStrictEqual(new Error('signup_informations_page.error_unauthorized'));
    });

    it('execute must return an error if adapter has code 409 ', async () => {
        expect.assertions(1);
        adapter.mockError({ error: { statusCode: 409, message: 'email already exist' } });
        const result = await usecase.execute('id', 22, 'email', 'firstname', 'MALE', 'lastname', file);

        expect(result).toStrictEqual(new Error('signup_informations_page.error_email_already_exist'));
    });

    it('execute must return an error if adapter has code 400 with image weight error message', async () => {
        expect.assertions(1);
        adapter.mockError({ error: { statusCode: 400, message: 'expected size' } });
        const result = await usecase.execute('id', 22, 'email', 'firstname', 'MALE', 'lastname', file);

        expect(result).toStrictEqual(new Error('signup_informations_page.error_picture_weight'));
    });

    it('execute must return an error if adapter has code 400 with image type error message', async () => {
        expect.assertions(1);
        adapter.mockError({ error: { statusCode: 400, message: 'expected type' } });
        const result = await usecase.execute('id', 22, 'email', 'firstname', 'MALE', 'lastname', file);

        expect(result).toStrictEqual(new Error('signup_informations_page.error_picture_format'));
    });
});
