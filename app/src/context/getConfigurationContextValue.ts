import CameraAdapter from '../adapter/CameraAdapter';
import DomainHttpAdapter from '../adapter/DomainHttpAdapter';
import Configuration from '../domain/entities/Confirguration';
import AskForAccountDeletion from '../domain/usecases/AskForAccountDeletionUsecase';
import AskForLanguageUsecase from '../domain/usecases/AskForLanguageUsecase';
import CreateProfileUsecase from '../domain/usecases/CreateProfileUsecase';
import CreateReportUsecase from '../domain/usecases/CreateReportUsecase';
import CreateUserUsecase from '../domain/usecases/CreateUserUsecase';
import GetAllCountriesUsecase from '../domain/usecases/GetAllCountriesUsecase';
import GetAllGoalsUsecase from '../domain/usecases/GetAllGoalsUsecase';
import GetAllInterestCategoriesUsecase from '../domain/usecases/GetAllInterestCategoriesUsecase';
import GetAllLanguagesUsecase from '../domain/usecases/GetAllLanguagesUsecase';
import GetAllReportCategoriesUsecase from '../domain/usecases/GetAllReportCategoriesUsecase';
import GetAllTandemsUsecase from '../domain/usecases/GetAllTandemsUsecase';
import GetAllUniversitiesUsecase from '../domain/usecases/GetAllUniversitiesUsecase';
import GetProfileByUserIdUsecase from '../domain/usecases/GetProfileUsecase';
import GetQuizzByLevelUsecase from '../domain/usecases/GetQuizzByLevelUsecase';
import GetUserUsecase from '../domain/usecases/GetUserUsecase';
import LoginUsecase from '../domain/usecases/LoginUsecase';
import ResetPasswordUsecase from '../domain/usecases/ResetPasswordUsecase';
import UpdateAvatarUsecase from '../domain/usecases/UpdateAvatarUsecase';
import UpdateNotificationPermissionUsecase from '../domain/usecases/UpdateNotificationPermissionUsecase';
import { ConfigContextValueType } from './configurationContextTypes';

const getConfigContextValue = (
    accessToken: string,
    refreshToken: string,
    setProfile: Function,
    setTokens: Function,
    setUser: Function,
    configuration: Configuration
): ConfigContextValueType => {
    const cameraAdapter = new CameraAdapter();
    const domainHttpAdapter = new DomainHttpAdapter(import.meta.env.VITE_API_URL ?? '', accessToken, refreshToken);

    const askForAccountDeletion = new AskForAccountDeletion(domainHttpAdapter);
    const askForLanguage = new AskForLanguageUsecase(domainHttpAdapter);
    const createProfile = new CreateProfileUsecase(domainHttpAdapter, setProfile);
    const createReport = new CreateReportUsecase(domainHttpAdapter);
    const getAllInterestCategories = new GetAllInterestCategoriesUsecase(domainHttpAdapter);
    const getAllCountries = new GetAllCountriesUsecase(domainHttpAdapter);
    const getAllGoals = new GetAllGoalsUsecase(domainHttpAdapter);
    const getAllLanguages = new GetAllLanguagesUsecase(domainHttpAdapter);
    const getAllReportCategories = new GetAllReportCategoriesUsecase(domainHttpAdapter);
    const getAllTandems = new GetAllTandemsUsecase(domainHttpAdapter);
    const getAllUniversities = new GetAllUniversitiesUsecase(domainHttpAdapter);
    const getProfile = new GetProfileByUserIdUsecase(domainHttpAdapter);
    const getQuizzByLevel = new GetQuizzByLevelUsecase(domainHttpAdapter);
    const getUser = new GetUserUsecase(domainHttpAdapter);
    const login = new LoginUsecase(domainHttpAdapter, setTokens);
    const resetPassword = new ResetPasswordUsecase(domainHttpAdapter);
    const updateAvatar = new UpdateAvatarUsecase(domainHttpAdapter);
    const updateNotificationPermission = new UpdateNotificationPermissionUsecase(domainHttpAdapter);

    const createUser = new CreateUserUsecase(domainHttpAdapter, login, setUser);

    return {
        askForAccountDeletion,
        askForLanguage,
        cameraAdapter,
        configuration,
        createProfile,
        createReport,
        createUser,
        getAllInterestCategories,
        getAllCountries,
        getAllGoals,
        getAllLanguages,
        getAllReportCategories,
        getAllTandems,
        getAllUniversities,
        getProfile,
        getQuizzByLevel,
        getUser,
        login,
        resetPassword,
        updateAvatar,
        updateNotificationPermission,
    };
};

export default getConfigContextValue;
