import { fetchUtils } from 'react-admin';

const http = async (method: string, path: string, init: Omit<RequestInit, 'method'> = {}) => {
    const response = await fetch(path, {
        ...init,
        method,
    });

    if (!response.ok) {
        throw new Error(response.statusText);
    }

    return response;
};

export const httpClient = (url: string, options: any = {}) => {
    const newOptions = options;
    if (!newOptions.headers) {
        newOptions.headers = new Headers({ Accept: 'application/json' });
    }
    const token = localStorage.getItem('accessToken');

    if (token) {
        newOptions.headers.set('Authorization', `Bearer ${token}`);
    }

    return fetchUtils.fetchJson(url, newOptions);
};

const authProvider = () => ({
    checkAuth: () => (localStorage.getItem('accessToken')
        ? Promise.resolve()
        : Promise.reject()),
    checkError: async () => {},
    getPermissions: async () => {},
    login: async ({ email, password }: { email: string, password: string}) => {
        const response = await http('POST', `${process.env.REACT_APP_API_URL}/authentication/token`, {
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });

        const payload = await response.json();
        localStorage.setItem('accessToken', JSON.stringify(payload.accessToken));
    },
    logout: async () => {
        localStorage.removeItem('accessToken');
    },
});

export default authProvider;
