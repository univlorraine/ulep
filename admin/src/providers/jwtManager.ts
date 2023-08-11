import jwtDecode from 'jwt-decode';

type Payload = {
    exp: number;
}

const jwtManager = () => {
    const getToken = (token: 'access_token' | 'refresh_token') => {
        const refreshToken = localStorage.getItem(token);
        if (!refreshToken) {
            return null;
        }

        const payload: Payload = jwtDecode(refreshToken);
        if (payload.exp < new Date().getTime() / 1000) {
            return null;
        }

        return refreshToken;
    };

    const setTokens = (accessToken: string, refreshToken:string) => {
        localStorage.setItem('access_token', accessToken);
        localStorage.setItem('refresh_token', refreshToken);
    };

    const ereaseTokens = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
    };

    return { getToken, setTokens, ereaseTokens };
};

export default jwtManager();
