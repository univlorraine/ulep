import DomainHttpAdapter from '../adapter/DomainHttpAdapter';
import KeycloakHttpAdapter from '../adapter/KeycloakHttpAdapter';
import LoginUsecase from '../domain/usecases/LoginUsecase';
import ResetPasswordUsecase from '../domain/usecases/ResetPasswordUsecase';
import { ConfigContextValueType } from './configurationContextTypes';

const getConfigContextValue = (
    accessToken: string,
    refreshToken: string,
    setTokens: Function,
    removeTokens: Function
): ConfigContextValueType => {
    const domainHttpAdapter = new DomainHttpAdapter(import.meta.env.VITE_API_URL ?? '', accessToken);
    const keycloakHttpAdapter = new KeycloakHttpAdapter(import.meta.env.VITE_KEYCLOAK_URL ?? '', accessToken);

    const loginUsecase = new LoginUsecase(domainHttpAdapter, setTokens);
    const resetPasswordUsecase = new ResetPasswordUsecase(keycloakHttpAdapter);
    return {
        loginUsecase,
        resetPasswordUsecase,
    };
};

export default getConfigContextValue;
