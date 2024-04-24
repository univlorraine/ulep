import jwtDecode, { JwtPayload } from 'jwt-decode';
import BaseHttpAdapter, { Body, HttpResponse } from './BaseHttpAdapter';
import { UseIonRouterResult } from '@ionic/react';

export interface HttpAdapterInterface {
    get: (path: string, args?: RequestInit, isTokenNeeded?: boolean, accessToken?: string) => Promise<Response>;
    post: (
        path: string,
        body: Body,
        args?: RequestInit,
        contentType?: string,
        isTokenNeeded?: boolean
    ) => Promise<Response>;
    put: (path: string, body: Body, args?: RequestInit, isTokenNeeded?: boolean) => Promise<Response>;
    patch: (path: string, body: Body, args?: RequestInit, isTokenNeeded?: boolean) => Promise<Response>;
    delete: (path: string, args?: RequestInit, isTokenNeeded?: boolean) => Promise<Response>;
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

    apiUrl: string = '';

    languageCode: string = '';

    refreshToken: string = '';

    setStorageTokens: Function;

    logout: Function;

    constructor(
        apiUrl: string,
        accessToken: string,
        refreshToken: string,
        languageCode: string,
        setTokens: Function,
        logout: Function
    ) {
        super();
        this.accessToken = accessToken;
        this.apiUrl = apiUrl;
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

    async put(path: string, body: Body, args: RequestInit = {}, isTokenNeeded = true): Promise<Response> {
        return this.withAuthCheck('put', { path: `${this.apiUrl}${path}`, args, body, isTokenNeeded });
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
            `${this.apiUrl}/authentication/refresh-token`,
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
