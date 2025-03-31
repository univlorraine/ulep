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

import jwtDecode, { JwtPayload } from 'jwt-decode';
import BaseHttpAdapter, { Body, HttpResponse } from './BaseHttpAdapter';

export interface HttpAdapterInterface {
    get: (path: string, args?: RequestInit, isTokenNeeded?: boolean, accessToken?: string) => Promise<Response>;
    post: (
        path: string,
        body: Body,
        args?: RequestInit,
        contentType?: string,
        isTokenNeeded?: boolean
    ) => Promise<Response>;
    put: (
        path: string,
        body: Body,
        args?: RequestInit,
        contentType?: string,
        isTokenNeeded?: boolean
    ) => Promise<Response>;
    patch: (path: string, body: Body, args?: RequestInit, isTokenNeeded?: boolean) => Promise<Response>;
    delete: (path: string, args?: RequestInit, isTokenNeeded?: boolean) => Promise<Response>;
    handleTokens: (isTokenNeeded: boolean) => Promise<void>;
}

interface RefreshUsecaseCommand {
    accessToken: string;
    refreshToken: string;
}

interface Tokens {
    accessToken: string;
    refreshToken: string;
}

interface RequestParams {
    path: string;
    args: RequestInit;
    isTokenNeeded: boolean;
    body?: Body;
    contentType?: string;
    accessToken?: string;
}

type Request = [string, RequestInit, Body?, string?];

type Action = 'get' | 'post' | 'delete' | 'put' | 'patch';

class DomainHttpAdapter extends BaseHttpAdapter implements HttpAdapterInterface {
    accessToken: string = '';

    authUrl: string = '';

    apiUrl: string = '';

    languageCode: string = '';

    refreshToken: string = '';

    setStorageTokens: Function;

    logout: Function;

    constructor(
        apiUrl: string,
        authUrl: string,
        accessToken: string,
        refreshToken: string,
        languageCode: string,
        setTokens: Function,
        logout: Function
    ) {
        super();
        this.accessToken = accessToken;
        this.apiUrl = apiUrl;
        this.authUrl = authUrl;
        this.languageCode = languageCode;
        this.refreshToken = refreshToken;
        this.setStorageTokens = setTokens;
        this.logout = logout;
    }

    private getHeaders(token?: string): any {
        return {
            Authorization: `Bearer ${token || this.accessToken}`,
            'Language-code': this.languageCode,
        };
    }

    async get(path: string, args: RequestInit = {}, isTokenNeeded = true, accessToken?: string): Promise<Response> {
        return this.withAuthCheck('get', { path: `${this.apiUrl}${path}`, args, isTokenNeeded, accessToken });
    }

    async delete(path: string, args: RequestInit = {}, isTokenNeeded = true): Promise<Response> {
        return this.withAuthCheck('delete', { path: `${this.apiUrl}${path}`, args, isTokenNeeded });
    }

    async post(
        path: string,
        body: Body,
        args: RequestInit = {},
        contentType = 'application/json',
        isTokenNeeded = true
    ): Promise<Response> {
        return this.withAuthCheck('post', { path: `${this.apiUrl}${path}`, args, body, contentType, isTokenNeeded });
    }

    async put(
        path: string,
        body: Body,
        args: RequestInit = {},
        contentType = 'application/json',
        isTokenNeeded = true
    ): Promise<Response> {
        return this.withAuthCheck('put', { path: `${this.apiUrl}${path}`, args, body, isTokenNeeded, contentType });
    }

    async patch(path: string, body: Body, args: RequestInit = {}, isTokenNeeded = true): Promise<Response> {
        return this.withAuthCheck('patch', { path: `${this.apiUrl}${path}`, args, body, isTokenNeeded });
    }

    async withAuthCheck(
        action: Action,
        { path, args, body, contentType, accessToken, isTokenNeeded }: RequestParams
    ): Promise<Response> {
        await this.handleTokens(isTokenNeeded);

        const requestInit = isTokenNeeded || accessToken ? { ...args, headers: this.getHeaders(accessToken) } : args;

        const request: Request = [path, requestInit, body, contentType];

        const response = await super[action](...request);

        if (isTokenNeeded && response.status === 401) {
            this.logoutAndRedirect();
        }

        return response;
    }

    async handleTokens(isTokenNeeded: boolean): Promise<void> {
        if (!isTokenNeeded) return;
        const isAccessTokenValid = await this.handleAccessToken();

        if (isAccessTokenValid) {
            return;
        }

        const isRefreshTokenValid = await this.handleRefreshToken();

        if (isRefreshTokenValid) {
            return;
        }

        this.logoutAndRedirect();
    }

    async handleAccessToken() {
        if (!this.accessToken || !this.refreshToken) {
            return false;
        }

        const jwtAccessDecoded = jwtDecode<JwtPayload>(this.accessToken);

        if (!jwtAccessDecoded || !jwtAccessDecoded.exp) {
            return false;
        }

        return jwtAccessDecoded.exp > Date.now() / 1000;
    }

    async handleRefreshToken() {
        if (this.refreshToken === '') {
            return false;
        }

        const response: HttpResponse<RefreshUsecaseCommand> = await super.post(
            `${this.authUrl}/authentication/refresh-token`,
            {},
            { token: this.refreshToken }
        );

        if (!response.parsedBody || !response.parsedBody.accessToken) {
            return false;
        }

        this.setTokens({
            accessToken: response.parsedBody.accessToken,
            refreshToken: response.parsedBody.refreshToken,
        });

        return true;
    }

    setTokens({ accessToken, refreshToken }: Tokens) {
        this.accessToken = accessToken;
        this.refreshToken = refreshToken;
        this.setStorageTokens({ accessToken, refreshToken });
    }

    logoutAndRedirect() {
        this.logout();
    }
}

export default DomainHttpAdapter;
