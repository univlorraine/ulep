import jwtDecode from 'jwt-decode';

type Payload = {
    exp: number;
}

const jwtManager = () => {
    const getToken = () => {
        const token = localStorage.getItem('token');
        if (!token) {
            return null;
        }

        const payload: Payload = jwtDecode(token);
        if (payload.exp < new Date().getTime() / 1000) {
            localStorage.removeItem('token');

            return null;
        }

        return token;
    };

    const setToken = (token: string) => localStorage.setItem('token', token);

    const ereaseToken = () => localStorage.removeItem('token');

    return { getToken, setToken, ereaseToken };
};

export default jwtManager();
