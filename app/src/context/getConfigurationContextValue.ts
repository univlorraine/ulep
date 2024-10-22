import BrowserAdapter from '../adapter/BrowserAdapter';
import CameraAdapter from '../adapter/CameraAdapter';
import DeviceAdapter from '../adapter/DeviceAdapter';
import DomainHttpAdapter from '../adapter/DomainHttpAdapter';
import FileAdapter from '../adapter/FileAdapter';
import NotificationAdapter from '../adapter/NotificationAdapter';
import { RecorderAdapter } from '../adapter/RecorderAdapter';
import Configuration from '../domain/entities/Confirguration';
import CreateActivityUsecase from '../domain/usecases/activity/CreateActivityUsecase';
import GetActivitiesUsecase from '../domain/usecases/activity/GetActivitiesUsecase';
import GetActivityThemesUsecase from '../domain/usecases/activity/GetActivityThemesUsecase';
import GetActivityUsecase from '../domain/usecases/activity/GetActivityUsecase';
import UpdateActivityStatusUsecase from '../domain/usecases/activity/UpdateActivityStatusUsecase';
import UpdateActivityUsecase from '../domain/usecases/activity/UpdateActivityUsecase';
import AddDeviceUsecase from '../domain/usecases/AddDeviceUsecase';
import AskForAccountDeletion from '../domain/usecases/AskForAccountDeletionUsecase';
import AskForLanguageUsecase from '../domain/usecases/AskForLanguageUsecase';
import AskForLearningLanguageUsecase from '../domain/usecases/AskForLearningLanguageUsecase';
import { GetInitialUrlUsecase, GetTokenFromCodeUsecase } from '../domain/usecases/AuthStandardFlow';
import CancelSessionUsecase from '../domain/usecases/CancelSessionUsecase';
import CreateOrUpdateTestedLanguageUsecase from '../domain/usecases/CreateOrUpdateTestedLanguageUsecase';
import CreateProfileUsecase from '../domain/usecases/CreateProfileUsecase';
import CreateReportMessageUsecase from '../domain/usecases/CreateReportMessageUsecase';
import CreateReportUsecase from '../domain/usecases/CreateReportUsecase';
import CreateSessionUsecase from '../domain/usecases/CreateSessionUsecase';
import CreateUserUsecase from '../domain/usecases/CreateUserUsecase';
import EditProfileUsecase from '../domain/usecases/EditProfileUsecase';
import EditUserUsecase from '../domain/usecases/EditUserUsecase';
import GetAllCountriesUsecase from '../domain/usecases/GetAllCountriesUsecase';
import GetAllGoalsUsecase from '../domain/usecases/GetAllGoalsUsecase';
import GetAllInterestCategoriesUsecase from '../domain/usecases/GetAllInterestCategoriesUsecase';
import GetAllLanguagesUsecase from '../domain/usecases/GetAllLanguagesUsecase';
import GetAllReportCategoriesUsecase from '../domain/usecases/GetAllReportCategoriesUsecase';
import GetAllSessionsUsecase from '../domain/usecases/GetAllSessionsUsecase';
import GetAllTandemsUsecase from '../domain/usecases/GetAllTandemsUsecase';
import GetAllUniversitiesUsecase from '../domain/usecases/GetAllUniversitiesUsecase';
import GetConversationsUsecase from '../domain/usecases/GetConversationsUsecase';
import GetHistoricEmailPartnerUsecase from '../domain/usecases/GetHistoricEmailPartnerUsecase';
import GetJitsiTokenUsecase from '../domain/usecases/GetJitsiTokenUsecase';
import GetMediaObjectUsecase from '../domain/usecases/GetMediaObjectUsecase';
import GetMessagesFromConversationUsecase from '../domain/usecases/GetMessagesFromConversationUsecase';
import GetPartnersToUniversityUsecase from '../domain/usecases/GetPartnersToUniversityUsecase';
import GetProfileByUserIdUsecase from '../domain/usecases/GetProfileUsecase';
import GetQuizzByLevelUsecase from '../domain/usecases/GetQuizzByLevelUsecase';
import GetUniversityLanguagesUsecase from '../domain/usecases/GetUniversityLanguagesUsecase';
import GetUniversityUsecase from '../domain/usecases/GetUniversityUsecase';
import GetUserUsecase from '../domain/usecases/GetUserUsecase';
import LoginUsecase from '../domain/usecases/LoginUsecase';
import GetAllNewsUsecase from '../domain/usecases/news/GetAllNewsUsecase';
import RefreshTokensUsecase from '../domain/usecases/RefreshTokensUsecase';
import ResetPasswordUsecase from '../domain/usecases/ResetPasswordUsecase';
import RetrievePersonInfoUsecase from '../domain/usecases/RetrievePersonInfoUsecase';
import RevokeSessionsUsecase from '../domain/usecases/RevokeSessionsUsecase';
import SearchMessagesIdsFromConversationUsecase from '../domain/usecases/SearchMessagesIdsFromConversationUsecase';
import SendMessageUsecase from '../domain/usecases/SendMessageUsecase';
import UpdateAvatarUsecase from '../domain/usecases/UpdateAvatarUsecase';
import UpdateNotificationPermissionUsecase from '../domain/usecases/UpdateNotificationPermissionUsecase';
import UpdateSessionUsecase from '../domain/usecases/UpdateSessionUsecase';
import CreateVocabularyListUsecase from '../domain/usecases/vocabulary/CreateVocabularyListUsecase';
import CreateVocabularyUsecase from '../domain/usecases/vocabulary/CreateVocabularyUsecase';
import DeleteVocabularyListUsecase from '../domain/usecases/vocabulary/DeleteVocabularyListUsecase';
import DeleteVocabularyUsecase from '../domain/usecases/vocabulary/DeleteVocabularyUsecase';
import GetVocabulariesFromListsIdUsecase from '../domain/usecases/vocabulary/GetVocabulariesFromListsIdUsecase';
import GetVocabulariesUsecase from '../domain/usecases/vocabulary/GetVocabulariesUsecase';
import GetVocabularyListPdfUsecase from '../domain/usecases/vocabulary/GetVocabularyListPdfUsecase';
import GetVocabularyListsUsecase from '../domain/usecases/vocabulary/GetVocabularyListsUsecase';
import UpdateVocabularyListUsecase from '../domain/usecases/vocabulary/UpdateVocabularyListUsecase';
import UpdateVocabularyUsecase from '../domain/usecases/vocabulary/UpdateVocabularyUsecase';
import { ConfigContextValueType } from './configurationContextTypes';

interface GetConfigContextValueProps {
    apiUrl: string;
    chatUrl: string;
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
    chatUrl,
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
    const domainHttpAdapter = new DomainHttpAdapter(
        apiUrl,
        apiUrl,
        accessToken,
        refreshToken,
        languageCode,
        setTokens,
        logout
    );
    const chatHttpAdapter = new DomainHttpAdapter(
        chatUrl,
        apiUrl,
        accessToken,
        refreshToken,
        languageCode,
        setTokens,
        logout
    );

    const refreshTokensUsecase = new RefreshTokensUsecase(domainHttpAdapter);
    const addDevice = new AddDeviceUsecase(domainHttpAdapter);
    const askForAccountDeletion = new AskForAccountDeletion(domainHttpAdapter);
    const askForLanguage = new AskForLanguageUsecase(domainHttpAdapter);
    const askForLearningLanguage = new AskForLearningLanguageUsecase(domainHttpAdapter);
    const createOrUpdateTestedLanguage = new CreateOrUpdateTestedLanguageUsecase(domainHttpAdapter, setProfile);
    const createProfile = new CreateProfileUsecase(domainHttpAdapter, setProfile);
    const createReport = new CreateReportUsecase(domainHttpAdapter);
    const createReportMessage = new CreateReportMessageUsecase(domainHttpAdapter);
    const getAllInterestCategories = new GetAllInterestCategoriesUsecase(domainHttpAdapter);
    const getAllCountries = new GetAllCountriesUsecase(domainHttpAdapter);
    const getAllGoals = new GetAllGoalsUsecase(domainHttpAdapter);
    const getAllLanguages = new GetAllLanguagesUsecase(domainHttpAdapter);
    const getAllReportCategories = new GetAllReportCategoriesUsecase(domainHttpAdapter);
    const getAllTandems = new GetAllTandemsUsecase(domainHttpAdapter);
    const getAllSessions = new GetAllSessionsUsecase(domainHttpAdapter);
    const getAllUniversities = new GetAllUniversitiesUsecase(domainHttpAdapter);
    const getHistoricEmailPartner = new GetHistoricEmailPartnerUsecase(domainHttpAdapter);
    const getPartnersToUniversity = new GetPartnersToUniversityUsecase(domainHttpAdapter);
    const getProfile = new GetProfileByUserIdUsecase(domainHttpAdapter);
    const getJitsiToken = new GetJitsiTokenUsecase(domainHttpAdapter);
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

    //Chat
    const fileAdapter = new FileAdapter(deviceAdapter);
    const recorderAdapter = new RecorderAdapter();
    const getConversations = new GetConversationsUsecase(domainHttpAdapter);
    const getMessagesFromConversation = new GetMessagesFromConversationUsecase(domainHttpAdapter);
    const sendMessage = new SendMessageUsecase(chatHttpAdapter);
    const searchMessagesIdsFromConversation = new SearchMessagesIdsFromConversationUsecase(chatHttpAdapter);

    // Vocabulary
    const createVocabulary = new CreateVocabularyUsecase(domainHttpAdapter);
    const updateVocabulary = new UpdateVocabularyUsecase(domainHttpAdapter);
    const deleteVocabulary = new DeleteVocabularyUsecase(domainHttpAdapter);
    const getVocabularies = new GetVocabulariesUsecase(domainHttpAdapter);
    const getVocabulariesFromListsIdUsecase = new GetVocabulariesFromListsIdUsecase(domainHttpAdapter);
    const getVocabularyLists = new GetVocabularyListsUsecase(domainHttpAdapter);
    const getVocabularyListPdf = new GetVocabularyListPdfUsecase(domainHttpAdapter, fileAdapter);
    const createVocabularyList = new CreateVocabularyListUsecase(domainHttpAdapter);
    const updateVocabularyList = new UpdateVocabularyListUsecase(domainHttpAdapter);
    const deleteVocabularyList = new DeleteVocabularyListUsecase(domainHttpAdapter);

    // Activity
    const createActivity = new CreateActivityUsecase(domainHttpAdapter);
    const getActivities = new GetActivitiesUsecase(domainHttpAdapter);
    const getActivity = new GetActivityUsecase(domainHttpAdapter);
    const getActivityThemes = new GetActivityThemesUsecase(domainHttpAdapter);
    const updateActivity = new UpdateActivityUsecase(domainHttpAdapter);
    const updateActivityStatus = new UpdateActivityStatusUsecase(domainHttpAdapter);

    // Session
    const createSession = new CreateSessionUsecase(domainHttpAdapter);
    const updateSession = new UpdateSessionUsecase(domainHttpAdapter);
    const cancelSession = new CancelSessionUsecase(domainHttpAdapter);

    //News
    const getAllNews = new GetAllNewsUsecase(domainHttpAdapter);

    return {
        accessToken,
        addDevice,
        askForAccountDeletion,
        askForLanguage,
        askForLearningLanguage,
        browserAdapter,
        cameraAdapter,
        configuration,
        createActivity,
        createOrUpdateTestedLanguage,
        createProfile,
        createReport,
        createReportMessage,
        createUser,
        editProfile,
        editUser,
        fileAdapter,
        deviceAdapter,
        getActivities,
        getActivity,
        getActivityThemes,
        getAllInterestCategories,
        getAllCountries,
        getAllGoals,
        getAllLanguages,
        getAllReportCategories,
        getAllTandems,
        getAllSessions,
        getAllUniversities,
        getConversations,
        getHistoricEmailPartner,
        getMediaObject,
        getMessagesFromConversation,
        getPartnersToUniversity,
        getProfile,
        getJitsiToken,
        getQuizzByLevel,
        getUser,
        getUniversity,
        getUniversityLanguages,
        login,
        notificationAdapter,
        resetPassword,
        searchMessagesIdsFromConversation,
        sendMessage,
        updateAvatar,
        updateNotificationPermission,
        recorderAdapter,
        retrievePerson,
        getTokenFromCodeUsecase,
        getInitialUrlUsecase,
        revokeSessionsUsecase,
        refreshTokensUsecase,
        createVocabulary,
        updateVocabulary,
        deleteVocabulary,
        getVocabularies,
        getVocabulariesFromListsIdUsecase,
        getVocabularyLists,
        getVocabularyListPdf,
        createVocabularyList,
        updateVocabularyList,
        deleteVocabularyList,
        updateActivity,
        updateActivityStatus,
        createSession,
        updateSession,
        cancelSession,
        getAllNews,
    };
};

export default getConfigContextValue;
