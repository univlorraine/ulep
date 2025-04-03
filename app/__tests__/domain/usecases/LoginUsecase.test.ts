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

import LoginUsecase from '../../../src/domain/usecases/LoginUsecase';
import DomainHttpAdapter from '../../mocks/adapters/HttpAdapter';

describe('loginUsecase', () => {
    let adapter: DomainHttpAdapter;
    let usecase: LoginUsecase;
    let mockedSetTokens: Function;
    beforeAll(() => {
        mockedSetTokens = jest.fn();
        adapter = new DomainHttpAdapter();
        usecase = new LoginUsecase(adapter, mockedSetTokens);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('execute function must call DomainHttpAdapter with specific path and params', async () => {
        expect.assertions(2);
        jest.spyOn(adapter, 'post');
        adapter.mockJson({ parsedBody: { accessToken: 'accessToken', refreshToken: 'refreshToken' } });
        await usecase.execute('email', 'password');
        expect(adapter.post).toHaveBeenCalledTimes(1);
        expect(adapter.post).toHaveBeenCalledWith(
            '/authentication/token',
            { email: 'email', password: 'password' },
            {},
            undefined,
            false
        );
    });

    it('execute must return an expected response', async () => {
        expect.assertions(2);

        adapter.mockJson({ parsedBody: { accessToken: 'accessToken', refreshToken: 'refreshToken' } });

        await usecase.execute('email', 'password');
        expect(mockedSetTokens).toHaveBeenCalledTimes(1);
        expect(mockedSetTokens).toHaveBeenCalledWith({ accessToken: 'accessToken', refreshToken: 'refreshToken' });
    });

    it('execute must return an expected response without parsed body', async () => {
        expect.assertions(2);

        adapter.mockJson({});

        const result = await usecase.execute('email', 'password');
        expect(mockedSetTokens).toHaveBeenCalledTimes(0);
        expect(result).toBeInstanceOf(Error);
    });

    it('execute must return an error if adapter return an 401 error', async () => {
        expect.assertions(1);
        adapter.mockJson({ ok: false, status: 401 });
        const result = await usecase.execute('email', 'password');
        expect(result).toStrictEqual(new Error('errors.userWrongCredentials'));
    });

    it('execute must return an error if adapter return a 404 error', async () => {
        expect.assertions(1);
        adapter.mockError({ status: 404 });
        const result = await usecase.execute('email', 'password');
        expect(result).toStrictEqual(new Error('errors.userDoesntExist'));
    });

    it('execute must return an error if adapter return an error', async () => {
        expect.assertions(1);
        adapter.mockError({ status: 407 });
        const result = await usecase.execute('email', 'password');
        expect(result).toStrictEqual(new Error('errors.global'));
    });

    it('execute must return an error if adapter return an error without status', async () => {
        expect.assertions(1);
        adapter.mockError({});
        const result = await usecase.execute('email', 'password');
        expect(result).toStrictEqual(new Error('errors.global'));
    });
});
