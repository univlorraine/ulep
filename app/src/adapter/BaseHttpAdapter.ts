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
                const value = body[key];
                if (Array.isArray(value)) {
                    value.forEach((item, index) => {
                        if (item instanceof File) {
                            encodedBody.append(`${key}[${index}]`, item);
                        } else if (item instanceof Object) {
                            Object.keys(item).forEach((subKey) => {
                                encodedBody.append(`${key}[${index}][${subKey}]`, item[subKey]);
                            });
                        } else {
                            encodedBody.append(`${key}[${index}]`, item);
                        }
                    });
                } else if (value !== undefined || value !== null) {
                    encodedBody.append(key, value);
                }
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
            Accept: 'application/json, application/pdf, text/csv',
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
                    } else if (responseContentType && responseContentType.indexOf('application/pdf') !== -1) {
                        return res.blob();
                    } else if (responseContentType && responseContentType.indexOf('text/csv') !== -1) {
                        return res.blob();
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
