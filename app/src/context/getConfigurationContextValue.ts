import DomainHttpAdapter from '../adapter/DomainHttpAdapter';
import KeycloakHttpAdapter from '../adapter/KeycloakHttpAdapter';
import GetAllCountriesUsecase from '../domain/usecases/GetAllCountriesUsecase';
import GetAllLanguagesUsecase from '../domain/usecases/GetAllLanguagesUsecase';
import GetAllUniversitiesUsecase from '../domain/usecases/GetAllUniversitiesUsecase';
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

    const getAllCountries = new GetAllCountriesUsecase(domainHttpAdapter);
    const getAllLanguages = new GetAllLanguagesUsecase(domainHttpAdapter);
    const getAllUniversities = new GetAllUniversitiesUsecase(domainHttpAdapter);
    const login = new LoginUsecase(domainHttpAdapter, setTokens);
    const resetPassword = new ResetPasswordUsecase(domainHttpAdapter);

    return {
        getAllCountries,
        getAllLanguages,
        getAllUniversities,
        login,
        resetPassword,
    };
};

export default getConfigContextValue;
