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

const authProvider = () => ({
    login: async ({ email, password }: { email: string; password: string }) => {
        // TODO(auth): API auth endpoint should be adapted to manage authentication using different clients
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
    logout: () => {
        jwtManager.ereaseTokens();

        return Promise.resolve();
    },
    checkAuth: async () => {
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
    checkError: async (error: any) => {
        const { status } = error;
        if (status === 401 || status === 403) {
            jwtManager.ereaseTokens();

            return Promise.reject();
        }

        return Promise.resolve();
    },
    getPermissions: async () => {
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
    getIdentity: async (): Promise<Identity> => {
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
});

export default authProvider;
