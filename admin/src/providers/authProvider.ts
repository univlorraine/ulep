import { AuthProvider } from 'react-admin';
import University from '../entities/University';
import jwtManager from './jwtManager';

export interface Identity {
    id: string;
    fullName?: string;
    universityId?: string;
    isCentralUniversity: boolean;
}

export const SUPER_ADMIN_PERMISSION = 'super-admin';
export const ADMIN_PERMISSION = 'admin';

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

        return Promise.reject();
    },
    logout() {
        jwtManager.ereaseTokens();

        return Promise.resolve();
    },
    async checkAuth() {
        if (jwtManager.getToken('access_token')) {
            return Promise.resolve();
        }
        const refreshToken = jwtManager.getToken('refresh_token');
        if (!refreshToken) {
            jwtManager.ereaseTokens();

            return Promise.reject();
        }

        const response = await http('POST', `${process.env.REACT_APP_API_URL}/authentication/refresh-token`, {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({
                token: refreshToken,
            }),
        });

        const payload = await response.json();
        jwtManager.setTokens(payload.accessToken, payload.refreshToken);

        return Promise.resolve();
    },
    async checkError(error: any) {
        if (error && (error.status === 401 || error.status === 403)) {
            jwtManager.ereaseTokens();

            return Promise.reject();
        }

        return Promise.resolve();
    },
    async getPermissions() {
        const accessToken = jwtManager.getToken('access_token');
        if (!accessToken) {
            return Promise.reject();
        }

        const decoded: any = jwtManager.decodeToken(accessToken);
        if (!decoded) {
            return Promise.reject();
        }

        return Promise.resolve(decoded.universityId ? ADMIN_PERMISSION : SUPER_ADMIN_PERMISSION);
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
            const centralUniversity = universities?.items?.find((university: University) => !university.parent);
            if (!centralUniversity) {
                return Promise.reject(new Error('No central university defined'));
            }
            universityId = centralUniversity.id;
            isCentralUniversity = true;
        }

        return Promise.resolve({
            id: decoded.sub,
            fullName: '',
            universityId,
            isCentralUniversity,
        });
    },
    async handleCallback() {
        const params = new URLSearchParams(window.location.search);
        const code = params.get('code');

        if (code) {
            const redirectUri = `${window.location.origin}`;
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

export default authProvider;
