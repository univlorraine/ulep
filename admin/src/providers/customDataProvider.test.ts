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

// react-admin is only used here for the http helpers and the refresh-auth
// wrapper: mocking it keeps this suite from pulling the whole UI package in.
jest.mock('react-admin', () => ({
    HttpError: class HttpError extends Error {},
    addRefreshAuthToDataProvider: (provider: unknown) => provider,
    addRefreshAuthToAuthProvider: (provider: unknown) => provider,
    fetchUtils: { fetchJson: jest.fn() },
}));

// eslint-disable-next-line import/first
import dataProvider from './customDataProvider';

const listParams = (page: number, perPage: number) => ({
    pagination: { page, perPage },
    sort: { field: 'email', order: 'ASC' as const },
    filter: {},
});

describe('customDataProvider getList', () => {
    let fetchMock: jest.Mock;

    beforeEach(() => {
        window.REACT_APP_API_URL = 'https://api.test';

        fetchMock = jest.fn().mockResolvedValue({
            ok: true,
            json: async () => ({ items: [], totalItems: 120 }),
        });
        global.fetch = fetchMock as unknown as typeof fetch;
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    const requestedUrl = () => new URL(fetchMock.mock.calls[0][0].toString());

    it('forwards pagination to the suggested languages endpoint', async () => {
        await dataProvider.getList('languages/requests', listParams(3, 25));

        const url = requestedUrl();
        expect(url.pathname).toBe('/languages/requests');
        expect(url.searchParams.get('page')).toBe('3');
        expect(url.searchParams.get('limit')).toBe('25');
    });

    it('sorts the suggested languages on a stable key', async () => {
        await dataProvider.getList('languages/requests', listParams(1, 10));

        const url = requestedUrl();
        expect(url.searchParams.get('field')).toBe('email');
        expect(url.searchParams.get('order')).toBe('asc');
    });

    it('forwards pagination to the suggested languages count endpoint', async () => {
        await dataProvider.getList('languages/requests/count', listParams(2, 10));

        const url = requestedUrl();
        expect(url.pathname).toBe('/languages/requests/count');
        expect(url.searchParams.get('page')).toBe('2');
        expect(url.searchParams.get('limit')).toBe('10');
    });
});
