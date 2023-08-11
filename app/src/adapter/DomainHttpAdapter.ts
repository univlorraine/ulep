import jwtDecode, { JwtPayload } from 'jwt-decode';
import BaseHttpAdapter, { Body, HttpResponse } from './BaseHttpAdapter';

export interface HttpAdapterInterface {
    get: (path: string, args?: RequestInit, isTokenNeeded?: boolean) => Promise<Response>;
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
    access_token: string;
    refresh_token: string;
}

class DomainHttpAdapter extends BaseHttpAdapter implements HttpAdapterInterface {
    accessToken: string = '';

    apiUrl: string = '';

    refreshToken: string = '';

    removeTokens: Function;

    setTokens: Function;

    constructor(
        apiUrl: string,
        accessToken: string,
        refreshToken: string,
        removeTokens: Function,
        setTokens: Function
    ) {
        super();
        this.accessToken = accessToken;
        this.apiUrl = apiUrl;
        this.refreshToken = refreshToken;
        this.removeTokens = removeTokens;
        this.setTokens = setTokens;
    }

    private getHeaders(): any {
        return {
            Authorization: `Bearer ${this.accessToken}`,
        };
    }

    async get(path: string, args: RequestInit = {}, isTokenNeeded = true): Promise<Response> {
        const isTokenValid = !isTokenNeeded || this.handleTokens();

        if (!isTokenValid) {
            throw new Error('errors.global');
        }
        return super.get(`${this.apiUrl}${path}`, { ...args, headers: this.getHeaders() });
    }

    async delete(path: string, args: RequestInit = {}, isTokenNeeded = true): Promise<Response> {
        const isTokenValid = isTokenNeeded && this.handleTokens();

        if (!isTokenValid) {
            throw new Error('errors.global');
        }
        return super.delete(`${this.apiUrl}${path}`, { ...args, headers: this.getHeaders() });
    }

    async post(
        path: string,
        body: Body,
        args: RequestInit = {},
        contentType = 'application/json',
        isTokenNeeded = true
    ): Promise<Response> {
        const isTokenValid = !isTokenNeeded || this.handleTokens();

        if (!isTokenValid) {
            throw new Error('errors.global');
        }
        return super.post(`${this.apiUrl}${path}`, body, { ...args, headers: this.getHeaders() }, contentType);
    }

    async put(path: string, body: Body, args: RequestInit = {}, isTokenNeeded = true): Promise<Response> {
        const isTokenValid = !isTokenNeeded || this.handleTokens();

        if (!isTokenValid) {
            throw new Error('errors.global');
        }
        return super.put(`${this.apiUrl}${path}`, body, { ...args, headers: this.getHeaders() });
    }

    handleTokens = async () => {
        if (!this.accessToken || !this.refreshToken) {
            return false;
        }

        const jwtDecoded = jwtDecode<JwtPayload>(this.accessToken);

        if (!jwtDecoded || !jwtDecoded.exp) {
            return false;
        }

        if (jwtDecoded.exp > Date.now() / 1000) {
            return true;
        }

        const response: HttpResponse<RefreshUsecaseCommand> = await super.post(
            `${this.apiUrl}/authentication/refresh-token`,
            { token: this.refreshToken }
        );

        if (!response.parsedBody || !response.parsedBody.access_token) {
            this.removeTokens();
            return false;
        }

        this.setTokens(response.parsedBody.access_token, response.parsedBody.refresh_token);
        return true;
    };
}

export default DomainHttpAdapter;
