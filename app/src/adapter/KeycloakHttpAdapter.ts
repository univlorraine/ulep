import BaseHttpAdapter, { Body } from './BaseHttpAdapter';
import { HttpAdapterInterface } from './DomainHttpAdapter';

class KeycloakHttpAdapter extends BaseHttpAdapter implements HttpAdapterInterface {
    accessToken: string = '';

    apiUrl: string = '';

    constructor(apiUrl: string, accessToken: string) {
        super();
        this.accessToken = accessToken;
        this.apiUrl = apiUrl;
    }

    private getHeaders(): any {
        return {
            Authorization: `Bearer ${this.accessToken}`,
        };
    }

    async get(path: string, args: RequestInit = {}): Promise<Response> {
        return super.get(`${this.apiUrl}${path}`, { ...args, headers: this.getHeaders() });
    }

    async delete(path: string, args: RequestInit = {}): Promise<Response> {
        return super.delete(`${this.apiUrl}${path}`, { ...args, headers: this.getHeaders() });
    }

    async post(path: string, body: Body, args: RequestInit = {}, contentType = 'application/json'): Promise<Response> {
        return super.post(`${this.apiUrl}${path}`, body, { ...args, headers: this.getHeaders() }, contentType);
    }

    async put(path: string, body: Body, args: RequestInit = {}): Promise<Response> {
        return super.put(`${this.apiUrl}${path}`, body, { ...args, headers: this.getHeaders() });
    }
}

export default KeycloakHttpAdapter;
