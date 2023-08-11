import jwtManager from './jwtManager';

const KEYCLOAK_URL = process.env.REACT_APP_KEYCLOAK_URL;
const KEYCLOAK_REALM = process.env.REACT_APP_KEYCLOAK_REALM;
const KEYCLOAK_CLIENT_ID = process.env.REACT_APP_KEYCLOAK_CLIENT_ID;
const KEYCLOAK_CLIENT_SECRET = process.env.REACT_APP_KEYCLOAK_CLIENT_SECRET;

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
    login: async ({ email, password }: { email: string, password: string }) => {
        const response = await http(
            'POST',
            `${KEYCLOAK_URL}/realms/${KEYCLOAK_REALM}/protocol/openid-connect/token`,
            {
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: new URLSearchParams({
                    username: email,
                    password,
                    grant_type: 'password',
                    client_id: KEYCLOAK_CLIENT_ID!,
                    client_secret: KEYCLOAK_CLIENT_SECRET!,
                    scope: 'openid',
                }),
            },
        );

        const payload = await response.json();
        jwtManager.setTokens(payload.access_token, payload.refresh_token);
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

        const response = await http(
            'POST',
            `${KEYCLOAK_URL}/realms/${KEYCLOAK_REALM}/protocol/openid-connect/token`,
            {
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: new URLSearchParams({
                    grant_type: 'refresh_token',
                    client_id: KEYCLOAK_CLIENT_ID!,
                    client_secret: KEYCLOAK_CLIENT_SECRET!,
                    refresh_token: refreshToken,
                }),
            },
        );

        const payload = await response.json();
        jwtManager.setTokens(payload.access_token, payload.refresh_token);

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
    getPermissions: () => (jwtManager.getToken('access_token') ? Promise.resolve() : Promise.reject()),
});

export default authProvider;
