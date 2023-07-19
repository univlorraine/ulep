import DomainHttpAdapter from '../adapter/DomainHttpAdapter';
import KeycloakHttpAdapter from '../adapter/KeycloakHttpAdapter';
import Configuration from '../domain/entities/Confirguration';
import GetAllCategoriesInterestssUsecase from '../domain/usecases/GetAllCategoriesInterestsUsecase';
import GetAllCountriesUsecase from '../domain/usecases/GetAllCountriesUsecase';
import GetAllGoalsUsecase from '../domain/usecases/GetAllGoalsUsecase';
import GetAllLanguagesUsecase from '../domain/usecases/GetAllLanguagesUsecase';
import GetAllUniversitiesUsecase from '../domain/usecases/GetAllUniversitiesUsecase';
import LoginUsecase from '../domain/usecases/LoginUsecase';
import ResetPasswordUsecase from '../domain/usecases/ResetPasswordUsecase';
import { ConfigContextValueType } from './configurationContextTypes';

const getConfigContextValue = (
    accessToken: string,
    refreshToken: string,
    setTokens: Function,
    removeTokens: Function,
    configuration: Configuration
): ConfigContextValueType => {
    const domainHttpAdapter = new DomainHttpAdapter(import.meta.env.VITE_API_URL ?? '', accessToken);
    const keycloakHttpAdapter = new KeycloakHttpAdapter(import.meta.env.VITE_KEYCLOAK_URL ?? '', accessToken);

    const getAllCategoriesInterests = new GetAllCategoriesInterestssUsecase(domainHttpAdapter);
    const getAllCountries = new GetAllCountriesUsecase(domainHttpAdapter);
    const getAllGoals = new GetAllGoalsUsecase(domainHttpAdapter);
    const getAllLanguages = new GetAllLanguagesUsecase(domainHttpAdapter);
    const getAllUniversities = new GetAllUniversitiesUsecase(domainHttpAdapter);
    const login = new LoginUsecase(domainHttpAdapter, setTokens);
    const resetPassword = new ResetPasswordUsecase(domainHttpAdapter);

    return {
        configuration,
        getAllCategoriesInterests,
        getAllCountries,
        getAllGoals,
        getAllLanguages,
        getAllUniversities,
        login,
        resetPassword,
    };
};

export default getConfigContextValue;
