import CameraAdapter from '../adapter/CameraAdapter';
import DomainHttpAdapter from '../adapter/DomainHttpAdapter';
import Configuration from '../domain/entities/Confirguration';
import AskForAccountDeletion from '../domain/usecases/AskForAccountDeletionUsecase';
import AskForLanguageUsecase from '../domain/usecases/AskForLanguageUsecase';
import AskForLearningLanguageUsecase from '../domain/usecases/AskForLearningLanguageUsecase';
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
import { GetTokenFromCodeUsecase, GetInitialUrlUsecase } from '../domain/usecases/AuthStandardFlow';
import GetUserUsecase from '../domain/usecases/GetUserUsecase';
import LoginUsecase from '../domain/usecases/LoginUsecase';
import ResetPasswordUsecase from '../domain/usecases/ResetPasswordUsecase';
import RetrievePersonInfoUsecase from '../domain/usecases/RetrievePersonInfoUsecase';
import UpdateAvatarUsecase from '../domain/usecases/UpdateAvatarUsecase';
import UpdateNotificationPermissionUsecase from '../domain/usecases/UpdateNotificationPermissionUsecase';
import { ConfigContextValueType } from './configurationContextTypes';
import GetUniversityUsecase from '../domain/usecases/GetUniversityUsecase';
import GetMediaObjectUsecase from '../domain/usecases/GetMediaObjectUsecase';
import RevokeSessionsUsecase from '../domain/usecases/RevokeSessionsUsecase';
import GetHistoricEmailPartnerUsecase from '../domain/usecases/GetHistoricEmailPartnerUsecase';
import BrowserAdapter from '../adapter/BrowserAdapter';
import DeviceAdapter from '../adapter/DeviceAdapter';
import GetUniversityLanguagesUsecase from '../domain/usecases/GetUniversityLanguagesUsecase';
import GetPartnersToUniversityUsecase from '../domain/usecases/GetPartnersToUniversityUsecase';
import EditProfileUsecase from '../domain/usecases/EditProfileUsecase';
import EditUserUsecase from '../domain/usecases/EditUserUsecase';
import CreateOrUpdateTestedLanguageUsecase from '../domain/usecases/CreateOrUpdateTestedLanguageUsecase';
import NotificationAdapter from '../adapter/NotificationAdapter';
import AddDeviceUsecase from '../domain/usecases/AddDeviceUsecase';

interface GetConfigContextValueProps {
    apiUrl: string;
    languageCode: string;
    accessToken: string;
    refreshToken: string;
    setProfile: Function;
    setTokens: Function;
    setUser: Function;
    configuration: Configuration;
    logout: Function;
}

const getConfigContextValue = ({
    apiUrl,
    languageCode,
    accessToken,
    refreshToken,
    setProfile,
    setTokens,
    setUser,
    configuration,
    logout,
}: GetConfigContextValueProps): ConfigContextValueType => {
    const browserAdapter = new BrowserAdapter();
    const cameraAdapter = new CameraAdapter();
    const deviceAdapter = new DeviceAdapter();
    const domainHttpAdapter = new DomainHttpAdapter(apiUrl, accessToken, refreshToken, languageCode, setTokens, logout);

    const addDevice = new AddDeviceUsecase(domainHttpAdapter);
    const askForAccountDeletion = new AskForAccountDeletion(domainHttpAdapter);
    const askForLanguage = new AskForLanguageUsecase(domainHttpAdapter);
    const askForLearningLanguage = new AskForLearningLanguageUsecase(domainHttpAdapter);
    const createOrUpdateTestedLanguage = new CreateOrUpdateTestedLanguageUsecase(domainHttpAdapter, setProfile);
    const createProfile = new CreateProfileUsecase(domainHttpAdapter, setProfile);
    const createReport = new CreateReportUsecase(domainHttpAdapter);
    const getAllInterestCategories = new GetAllInterestCategoriesUsecase(domainHttpAdapter);
    const getAllCountries = new GetAllCountriesUsecase(domainHttpAdapter);
    const getAllGoals = new GetAllGoalsUsecase(domainHttpAdapter);
    const getAllLanguages = new GetAllLanguagesUsecase(domainHttpAdapter);
    const getAllReportCategories = new GetAllReportCategoriesUsecase(domainHttpAdapter);
    const getAllTandems = new GetAllTandemsUsecase(domainHttpAdapter);
    const getAllUniversities = new GetAllUniversitiesUsecase(domainHttpAdapter);
    const getHistoricEmailPartner = new GetHistoricEmailPartnerUsecase(domainHttpAdapter);
    const getPartnersToUniversity = new GetPartnersToUniversityUsecase(domainHttpAdapter);
    const getProfile = new GetProfileByUserIdUsecase(domainHttpAdapter);
    const getQuizzByLevel = new GetQuizzByLevelUsecase(domainHttpAdapter);
    const getUser = new GetUserUsecase(domainHttpAdapter);
    const getUniversityLanguages = new GetUniversityLanguagesUsecase(domainHttpAdapter);
    const getMediaObject = new GetMediaObjectUsecase(domainHttpAdapter);
    const getUniversity = new GetUniversityUsecase(domainHttpAdapter);
    const notificationAdapter = new NotificationAdapter();
    const login = new LoginUsecase(domainHttpAdapter, setTokens);
    const revokeSessionsUsecase = new RevokeSessionsUsecase(domainHttpAdapter);
    const getTokenFromCodeUsecase = new GetTokenFromCodeUsecase(domainHttpAdapter, setTokens);
    const getInitialUrlUsecase = new GetInitialUrlUsecase(apiUrl);
    const resetPassword = new ResetPasswordUsecase(domainHttpAdapter);
    const updateAvatar = new UpdateAvatarUsecase(domainHttpAdapter);
    const updateNotificationPermission = new UpdateNotificationPermissionUsecase(domainHttpAdapter);

    const createUser = new CreateUserUsecase(domainHttpAdapter, login, setUser);
    const editProfile = new EditProfileUsecase(domainHttpAdapter, setProfile);
    const editUser = new EditUserUsecase(domainHttpAdapter, setUser);
    const retrievePerson = new RetrievePersonInfoUsecase(domainHttpAdapter);

    return {
        accessToken,
        addDevice,
        askForAccountDeletion,
        askForLanguage,
        askForLearningLanguage,
        browserAdapter,
        cameraAdapter,
        configuration,
        createOrUpdateTestedLanguage,
        createProfile,
        createReport,
        createUser,
        editProfile,
        editUser,
        deviceAdapter,
        getAllInterestCategories,
        getAllCountries,
        getAllGoals,
        getAllLanguages,
        getAllReportCategories,
        getAllTandems,
        getAllUniversities,
        getHistoricEmailPartner,
        getMediaObject,
        getPartnersToUniversity,
        getProfile,
        getQuizzByLevel,
        getUser,
        getUniversity,
        getUniversityLanguages,
        login,
        notificationAdapter,
        resetPassword,
        updateAvatar,
        updateNotificationPermission,
        retrievePerson,
        getTokenFromCodeUsecase,
        getInitialUrlUsecase,
        revokeSessionsUsecase,
    };
};

export default getConfigContextValue;
