import DomainHttpAdapter from '../adapter/DomainHttpAdapter';
import LoginUsecase from '../domain/usecases/LoginUsecase';
import { ConfigContextValueType } from './configurationContextTypes';

const getConfigContextValue = (
    accessToken: string,
    refreshToken: string,
    setTokens: Function,
    removeTokens: Function
): ConfigContextValueType => {
    const domainHttpAdapter = new DomainHttpAdapter(import.meta.env.VITE_API_URL ?? '', accessToken);

    const loginUsecase = new LoginUsecase(domainHttpAdapter, setTokens);
    return {
        loginUsecase,
    };
};

export default getConfigContextValue;
