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

const redirectUri = `${window.location.origin}/#/auth-callback`;

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
        const response = await http('POST', `${process.env.REACT_APP_API_URL}/authentication/token/admin`, {
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
