export interface Body {
    [key: string]: any;
}

export interface HttpResponse<T> extends Response {
    parsedBody?: T;
    error?: Error;
}

class BaseHttpAdapter {
    get(path: string, args: RequestInit = {}): Promise<Response> {
        return this.http(path, { ...args, method: 'GET' });
    }

    delete(path: string, args: RequestInit = {}): Promise<Response> {
        return this.http(path, { ...args, method: 'DELETE' });
    }

    post(path: string, args: RequestInit = {}, body: Body = {}, contentType = 'application/json'): Promise<Response> {
        let encodedBody: any;

        if (contentType === 'multipart/form-data') {
            encodedBody = new FormData();
            Object.keys(body).forEach((key) => {
                encodedBody.append(key, body[key]);
            });
        } else {
            encodedBody = JSON.stringify(body);
        }
        return this.http(path, { ...args, method: 'POST', body: encodedBody }, contentType);
    }

    put(path: string, args: RequestInit = {}, body: Body = {}): Promise<Response> {
        return this.http(path, {
            ...args,
            method: 'PUT',
            body: JSON.stringify(body),
        });
    }

    patch(path: string, args: RequestInit = {}, body: Body = {}): Promise<Response> {
        return this.http(path, {
            ...args,
            method: 'PATCH',
            body: JSON.stringify(body),
        });
    }

    async http<T>(path: string, args: RequestInit, contentType = 'application/json'): Promise<HttpResponse<T>> {
        const headers: Record<string, string> = {
            ...(args.headers as Record<string, string>),
            Accept: 'application/json',
        };

        if (contentType !== 'multipart/form-data') {
            headers['Content-Type'] = contentType;
        }

        const request = new Request(path, {
            ...args,
            headers,
        });

        return new Promise((resolve, reject) => {
            let response: HttpResponse<T>;

            fetch(request)
                .then(async (res) => {
                    response = res;

                    if (res.status >= 400) {
                        return res.json();
                    }

                    if (res.status >= 204) {
                        return { ok: true };
                    }

                    const responseContentType = res.headers.get('content-type');
                    if (responseContentType && responseContentType.indexOf('application/json') !== -1) {
                        return res.json();
                    }

                    return { ok: true };
                })
                .then((result) => {
                    if (response.ok || response.status === 401) {
                        response.parsedBody = result;
                        resolve(response);
                    } else {
                        response.error = result;
                        reject(response);
                    }
                })
                .catch((error) => {
                    console.error(error);
                    reject(error);
                });
        });
    }
}

export default BaseHttpAdapter;
