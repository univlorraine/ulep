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

import { AuthProvider, UserIdentity, addRefreshAuthToAuthProvider } from 'react-admin';
import { Role } from '../entities/Administrator';
import { isCentralUniversity as checkIsCentralUniversity } from '../entities/University';
import jwtManager from './jwtManager';

export interface Identity {
    id: string;
    fullName?: string;
    firstName: string;
    lastName: string;
    email: string;
    universityId?: string;
    isCentralUniversity: boolean;
    data: any;
}

export interface GetPermissionsInterface {
    checkRole: (roleToCheck: Role) => boolean;
    checkRoles: (roleToCheck: Role[]) => boolean;
}

const canAccessAdmin = (decoded: any) => {
    if (!decoded) {
        return false;
    }

    const isAdmin = decoded.realm_access?.roles.includes('admin');
    const isSuperAdmin = decoded.realm_access?.roles.includes('super-admin');

    return isAdmin && (decoded.universityId || isSuperAdmin);
};

export const http = async (method: string, path: string, init: Omit<RequestInit, 'method'> = {}) => {
    const response = await fetch(path, {
        ...init,
        method,
    });

    if (!response.ok) {
        throw new Error(response.statusText);
    }

    return response;
};

const redirectUri = `${window.location.origin}/auth-callback`;

export const ssoLogin = () => {
    window.location.href = `${window.REACT_APP_API_URL}/authentication/flow?redirectUri=${encodeURIComponent(
        redirectUri
    )}`;
};

export const refreshAuth = async () => {
    const { accessToken, refreshToken } = jwtManager.getTokens();

    if (!refreshToken || !accessToken) {
        return Promise.reject();
    }

    const decoded = jwtManager.decodeToken(accessToken);

    if (decoded.exp && decoded.exp < Date.now() / 1000) {
        // This function will fetch the new tokens from the authentication service and update them in localStorage
        const response = await http('POST', `${window.REACT_APP_API_URL}/authentication/refresh-token`, {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({
                token: refreshToken,
            }),
        });

        const payload = await response.json();
        jwtManager.setTokens(payload.accessToken, payload.refreshToken);
    }

    return Promise.resolve();
};

const authProvider: AuthProvider = {
    async login({ email, password }: { email: string; password: string }) {
        const response = await http('POST', `${window.REACT_APP_API_URL}/authentication/token/admin`, {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({
                email,
                password,
            }),
        });

        const payload = await response.json();

        // Check that user has admin role to authorize login
        const decoded: any = jwtManager.decodeToken(payload.accessToken);

        if (canAccessAdmin(decoded)) {
            jwtManager.setTokens(payload.accessToken, payload.refreshToken);

            return Promise.resolve();
        }

        return Promise.reject(new Error('Login fail.'));
    },
    async logout() {
        const accessToken = jwtManager.getToken('access_token');
        if (accessToken) {
            try {
                await http('POST', `${window.REACT_APP_API_URL}/users/revoke`, {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${accessToken}`,
                    },
                });
            } catch (err) {
                console.error('Fail to revoke user session', err);
                jwtManager.ereaseTokens();
            }
        }

        jwtManager.ereaseTokens();

        return Promise.resolve();
    },
    checkAuth() {
        if (jwtManager.getToken('access_token')) {
            return Promise.resolve();
        }

        return Promise.reject(new Error('Auth fail'));
    },
    checkError(error) {
        if (error && (error.status === 401 || error.status === 403)) {
            jwtManager.ereaseTokens();

            return Promise.reject(new Error('Forbidden'));
        }

        return Promise.resolve();
    },
    getPermissions(): Promise<GetPermissionsInterface> {
        const accessToken = jwtManager.getToken('access_token');
        if (!accessToken) {
            return Promise.reject(new Error('Access token not found.'));
        }

        const decoded: any = jwtManager.decodeToken(accessToken);

        if (!decoded) {
            return Promise.reject(new Error("Can't decode access token."));
        }

        const roles = decoded.realm_access?.roles;

        const permissions = {
            checkRole: (roleToCheck: Role) => roles.includes(roleToCheck),
            checkRoles: (rolesToCheck: Role[]) => rolesToCheck.some((roleToCheck) => roles.includes(roleToCheck)),
        };

        return Promise.resolve(permissions);
    },
    async getIdentity(): Promise<UserIdentity> {
        const accessToken = jwtManager.getToken('access_token');
        if (!accessToken) {
            return Promise.reject(new Error('Fail to get access token'));
        }

        const decoded: any = jwtManager.decodeToken(accessToken);
        if (!decoded) {
            return Promise.reject(new Error('Fail to decode token'));
        }

        const universitiesRes = await fetch(`${window.REACT_APP_API_URL}/universities`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        const universities = await universitiesRes.json();
        const centralUniversity = universities?.items?.find(checkIsCentralUniversity);
        if (!centralUniversity) {
            return Promise.reject(new Error('No central university defined'));
        }
        const isCentralUniversity = decoded.universityId === centralUniversity.id;

        const identity: Identity = {
            id: decoded.sub,
            data: decoded,
            firstName: decoded.given_name,
            lastName: decoded.family_name,
            fullName: '',
            email: decoded.email,
            isCentralUniversity,
        };

        if (decoded.realm_access?.roles.includes('super-admin')) {
            return Promise.resolve({ ...identity, universityId: centralUniversity.id, isCentralUniversity: true });
        }

        return Promise.resolve({
            ...identity,
            universityId: decoded.universityId,
            isCentralUniversity: decoded.universityId === centralUniversity.id,
        });
    },
    async handleCallback() {
        const params = new URLSearchParams(window.location.search);
        const code = params.get('code');

        if (code) {
            const response = await http('POST', `${window.REACT_APP_API_URL}/authentication/flow/code`, {
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: new URLSearchParams({
                    code,
                    redirectUri,
                }),
            });

            const payload = await response.json();

            const decoded: any = jwtManager.decodeToken(payload.accessToken);

            if (canAccessAdmin(decoded)) {
                jwtManager.setTokens(payload.accessToken, payload.refreshToken);

                return;
            }
        }

        throw new Error("User doesn't have access privileges");
    },
};

export default addRefreshAuthToAuthProvider(authProvider, refreshAuth);
