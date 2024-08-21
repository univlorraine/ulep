import jwtDecode, { JwtPayload } from 'jwt-decode';

const jwtManager = {
    getToken: (token: 'access_token' | 'refresh_token') => localStorage.getItem(token),
    getTokens: () => ({
        accessToken: localStorage.getItem('access_token'),
        refreshToken: localStorage.getItem('refresh_token'),
    }),
    setTokens: (accessToken: string, refreshToken: string) => {
        localStorage.setItem('access_token', accessToken);
        localStorage.setItem('refresh_token', refreshToken);
    },
    ereaseTokens: () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
    },
    decodeToken: (token: string): JwtPayload => jwtDecode(token),
};

export default jwtManager;
