import jwtDecode, { JwtPayload } from 'jwt-decode';

type Tokens = 'access_token' | 'refresh_token';

const jwtManager = () => {
    const getToken = (token: Tokens) => localStorage.getItem(token);

    const getTokens = () => ({
        accessToken: localStorage.getItem('access_token'),
        refreshToken: localStorage.getItem('refresh_token'),
    });

    const setTokens = (accessToken: string, refreshToken: string) => {
        localStorage.setItem('access_token', accessToken);
        localStorage.setItem('refresh_token', refreshToken);
    };

    const ereaseTokens = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
    };

    const decodeToken = (token: string): JwtPayload => jwtDecode(token);

    return { getToken, getTokens, setTokens, ereaseTokens, decodeToken };
};

export default jwtManager();
