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

class DomainHttpAdapter extends BaseHttpAdapter implements HttpAdapterInterface {
    accessToken: string = '';

    apiUrl: string = '';

    languageCode: string = '';

    refreshToken: string = '';

    setStorageTokens: Function;

    logout: Function;

    router?: UseIonRouterResult;

    constructor(
        apiUrl: string,
        accessToken: string,
        refreshToken: string,
        languageCode: string,
        setTokens: Function,
        logout: Function,
        router?: UseIonRouterResult
    ) {
        super();
        this.accessToken = accessToken;
        this.apiUrl = apiUrl;
        this.languageCode = languageCode;
        this.refreshToken = refreshToken;
        this.setStorageTokens = setTokens;
        this.logout = logout;
        this.router = router;
    }

    private getHeaders(token?: string): any {
        return {
            Authorization: `Bearer ${token || this.accessToken}`,
            'Language-code': this.languageCode,
        };
    }

    async get(path: string, args: RequestInit = {}, isTokenNeeded = true, accessToken?: string): Promise<Response> {
        return this.withAuthCheck(
            super.get(`${this.apiUrl}${path}`, { ...args, headers: this.getHeaders(accessToken) }),
            isTokenNeeded
        );
    }

    async delete(path: string, args: RequestInit = {}, isTokenNeeded = true): Promise<Response> {
        return this.withAuthCheck(
            super.delete(`${this.apiUrl}${path}`, { ...args, headers: this.getHeaders() }),
            isTokenNeeded
        );
    }

    async post(
        path: string,
        body: Body,
        args: RequestInit = {},
        contentType = 'application/json',
        isTokenNeeded = true
    ): Promise<Response> {
        return this.withAuthCheck(
            super.post(`${this.apiUrl}${path}`, body, { ...args, headers: this.getHeaders() }, contentType),
            isTokenNeeded
        );
    }

    async put(path: string, body: Body, args: RequestInit = {}, isTokenNeeded = true): Promise<Response> {
        return this.withAuthCheck(
            super.put(`${this.apiUrl}${path}`, body, { ...args, headers: this.getHeaders() }),
            isTokenNeeded
        );
    }

    async withAuthCheck(request: Promise<Response>, isTokenNeeded: boolean) {
        await this.handleTokens(isTokenNeeded);

        const response = await request;

        if (response.status === 401) {
            this.logoutAndRedirect();
        }

        return response;
    }

    handleTokens = async (isTokenNeeded: boolean): Promise<void> => {
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
    };

    handleAccessToken = async () => {
        if (!this.accessToken || !this.refreshToken) {
            return false;
        }

        const jwtAccessDecoded = jwtDecode<JwtPayload>(this.accessToken);

        if (!jwtAccessDecoded || !jwtAccessDecoded.exp) {
            return false;
        }

        return jwtAccessDecoded.exp > Date.now() / 1000;
    };

    handleRefreshToken = async () => {
        if (this.refreshToken === '') {
            return false;
        }

        const response: HttpResponse<RefreshUsecaseCommand> = await super.post(
            `${this.apiUrl}/authentication/refresh-token`,
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
    };

    setTokens = ({ accessToken, refreshToken }: Tokens) => {
        this.accessToken = accessToken;
        this.refreshToken = refreshToken;
        this.setStorageTokens({ accessToken, refreshToken });
    };

    logoutAndRedirect = () => {
        this.logout();
        if (this.router) this.router.push('/login');
    };
}

export default DomainHttpAdapter;
