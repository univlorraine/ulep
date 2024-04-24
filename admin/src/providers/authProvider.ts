import { AuthProvider, addRefreshAuthToAuthProvider } from 'react-admin';
import { isCentralUniversity as checkIsCentralUniversity } from '../entities/University';
import jwtManager from './jwtManager';

export interface Identity {
    id: string;
    fullName?: string;
    data: {
        firstname: string;
        lastname: string;
        email: string;
    };
    universityId?: string;
    isCentralUniversity: boolean;
}

export interface GetPermissionsInterface {
    checkRole: (roleToCheck: Role) => boolean;
    checkRoles: (roleToCheck: Role[]) => boolean;
}

export enum Role {
    ADMIN = 'admin',
    SUPER_ADMIN = 'super-admin',
    ANIMATOR = 'animator',
    MANAGER = 'manager',
}

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
    window.location.href = `${process.env.REACT_APP_API_URL}/authentication/flow?redirectUri=${encodeURIComponent(
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
        const response = await http('POST', `${process.env.REACT_APP_API_URL}/authentication/refresh-token`, {
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
        const response = await http('POST', `${process.env.REACT_APP_API_URL}/authentication/token`, {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({
                email,
                password,
            }),
        });

        const payload = await response.json();

        // Check that user has admin role to authorize login
        const decoded: any = jwtManager.decodeToken(payload.accessToken);
        if (decoded) {
            const isAdmin = decoded.realm_access?.roles.includes('admin');
            if (isAdmin) {
                jwtManager.setTokens(payload.accessToken, payload.refreshToken);

                return Promise.resolve();
            }
        }

        return Promise.reject(new Error('Login fail.'));
    },
    async logout() {
        const accessToken = jwtManager.getToken('access_token');
        if (accessToken) {
            try {
                await http('POST', `${process.env.REACT_APP_API_URL}/users/revoke`, {
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
    async getIdentity(): Promise<Identity> {
        const accessToken = jwtManager.getToken('access_token');
        if (!accessToken) {
            return Promise.reject(new Error('Fail to get access token'));
        }

        const decoded: any = jwtManager.decodeToken(accessToken);
        if (!decoded) {
            return Promise.reject(new Error('Fail to decode token'));
        }

        let { universityId } = decoded;
        let isCentralUniversity = false;

        if (!universityId) {
            const universitiesRes = await fetch(`${process.env.REACT_APP_API_URL}/universities`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            const universities = await universitiesRes.json();
            const centralUniversity = universities?.items?.find(checkIsCentralUniversity);
            if (!centralUniversity) {
                return Promise.reject(new Error('No central university defined'));
            }
            universityId = centralUniversity.id;
            isCentralUniversity = true;
        }

        return Promise.resolve({
            id: decoded.sub,
            data: decoded,
            fullName: '',
            universityId,
            isCentralUniversity,
        });
    },
    async handleCallback() {
        const params = new URLSearchParams(window.location.search);
        const code = params.get('code');

        if (code) {
            const response = await http('POST', `${process.env.REACT_APP_API_URL}/authentication/flow/code`, {
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: new URLSearchParams({
                    code,
                    redirectUri,
                }),
            });

            const payload = await response.json();

            const decoded: any = jwtManager.decodeToken(payload.accessToken);
            if (decoded) {
                const isAdmin = decoded.realm_access?.roles.includes('admin');
                if (isAdmin) {
                    jwtManager.setTokens(payload.accessToken, payload.refreshToken);

                    return;
                }
            }
        }

        throw new Error("User doesn't have access privileges");
    },
};

export default addRefreshAuthToAuthProvider(authProvider, refreshAuth);
