import BrowserAdapter from '../adapter/BrowserAdapter';
import CameraAdapter from '../adapter/CameraAdapter';
import DeviceAdapter from '../adapter/DeviceAdapter';
import DomainHttpAdapter from '../adapter/DomainHttpAdapter';
import FileAdapter from '../adapter/FileAdapter';
import NotificationAdapter from '../adapter/NotificationAdapter';
import { RecorderAdapter } from '../adapter/RecorderAdapter';
import Configuration from '../domain/entities/Confirguration';
import CreateActivityUsecase from '../domain/usecases/activity/CreateActivityUsecase';
import DeleteActivityUsecase from '../domain/usecases/activity/DeleteActivityUsecase';
import GetActivitiesUsecase from '../domain/usecases/activity/GetActivitiesUsecase';
import GetActivityPdfUsecase from '../domain/usecases/activity/GetActivityPdfUsecase';
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
import GetConversationsUsecase from '../domain/usecases/chat/GetConversationsUsecase';
import GetHashtagsFromConversationUsecase from '../domain/usecases/chat/GetHashtagsFromConversationUsecase';
import GetMessagesFromConversationUsecase from '../domain/usecases/chat/GetMessagesFromConversationUsecase';
import SearchMessagesIdsFromConversationUsecase from '../domain/usecases/chat/SearchMessagesIdsFromConversationUsecase';
import SendMessageUsecase from '../domain/usecases/chat/SendMessageUsecase';
import CreateCustomLearningGoalUsecase from '../domain/usecases/CreateCustomLearningGoalUsecase';
import CreateOrUpdateTestedLanguageUsecase from '../domain/usecases/CreateOrUpdateTestedLanguageUsecase';
import CreateProfileUsecase from '../domain/usecases/CreateProfileUsecase';
import CreateReportMessageUsecase from '../domain/usecases/CreateReportMessageUsecase';
import CreateReportUsecase from '../domain/usecases/CreateReportUsecase';
import CreateSessionUsecase from '../domain/usecases/CreateSessionUsecase';
import CreateUserUsecase from '../domain/usecases/CreateUserUsecase';
import DeleteCustomLearningGoalUsecase from '../domain/usecases/DeleteCustomLearningGoalUsecase';
import EditProfileUsecase from '../domain/usecases/EditProfileUsecase';
import EditUserUsecase from '../domain/usecases/EditUserUsecase';
import GetAllEventsUsecase from '../domain/usecases/event/GetAllEventsUsecase';
import GetEventUsecase from '../domain/usecases/event/GetEventUsecase';
import SubscribeToEventUsecase from '../domain/usecases/event/SubscribeToEventUsecase';
import UnsubscribeToEventUsecase from '../domain/usecases/event/UnsubscribeToEventUsecase';
import ExportMediasFromConversationUsecase from '../domain/usecases/ExportMediasFromConversationUsecase';
import GetAllCountriesUsecase from '../domain/usecases/GetAllCountriesUsecase';
import GetAllGoalsUsecase from '../domain/usecases/GetAllGoalsUsecase';
import GetAllInterestCategoriesUsecase from '../domain/usecases/GetAllInterestCategoriesUsecase';
import GetAllLanguagesUsecase from '../domain/usecases/GetAllLanguagesUsecase';
import GetAllSessionsUsecase from '../domain/usecases/GetAllSessionsUsecase';
import GetAllTandemsUsecase from '../domain/usecases/GetAllTandemsUsecase';
import GetAllUniversitiesUsecase from '../domain/usecases/GetAllUniversitiesUsecase';
import GetEditoByUniversityIdUsecase from '../domain/usecases/GetEditoByUniversityIdUsecase';
import GetHistoricEmailPartnerUsecase from '../domain/usecases/GetHistoricEmailPartnerUsecase';
import GetJitsiTokenUsecase from '../domain/usecases/GetJitsiTokenUsecase';
import GetMediaObjectUsecase from '../domain/usecases/GetMediaObjectUsecase';
import GetPartnersToUniversityUsecase from '../domain/usecases/GetPartnersToUniversityUsecase';
import GetProfileByUserIdUsecase from '../domain/usecases/GetProfileUsecase';
import GetQuizzByLevelUsecase from '../domain/usecases/GetQuizzByLevelUsecase';
import GetUniversityLanguagesUsecase from '../domain/usecases/GetUniversityLanguagesUsecase';
import GetUniversityUsecase from '../domain/usecases/GetUniversityUsecase';
import GetUserUsecase from '../domain/usecases/GetUserUsecase';
import CreateLogEntryUsecase from '../domain/usecases/log-entries/CreateLogEntryUsecase';
import ExportLogEntriesUsecase from '../domain/usecases/log-entries/ExportLogEntriesUsecase';
import GetLogEntriesByDateUsecase from '../domain/usecases/log-entries/GetLogEntriesByDateUsecase';
import GetLogEntriesUsecase from '../domain/usecases/log-entries/GetLogEntriesUsecase';
import ShareLogEntriesUsecase from '../domain/usecases/log-entries/ShareLogEntriesUsecase';
import UnshareLogEntriesUsecase from '../domain/usecases/log-entries/UnshareLogEntriesUsecase';
import UpdateCustomLogEntryUsecase from '../domain/usecases/log-entries/UpdateCustomLogEntryUsecase';
import UpdateVisioDurationUsecase from '../domain/usecases/log-entries/UpdateVisioDurationUsecase';
import LoginUsecase from '../domain/usecases/LoginUsecase';
import GetAllNewsUsecase from '../domain/usecases/news/GetAllNewsUsecase';
import RefreshTokensUsecase from '../domain/usecases/RefreshTokensUsecase';
import GetAllReportCategoriesUsecase from '../domain/usecases/reports/GetAllReportCategoriesUsecase';
import GetAllReportsUsecase from '../domain/usecases/reports/GetAllReportsUsecase';
import GetReportUsecase from '../domain/usecases/reports/GetReportUsecase';
import UpdateReportStatusUsecase from '../domain/usecases/reports/UpdateReportStatusUsecase';
import ResetPasswordUsecase from '../domain/usecases/ResetPasswordUsecase';
import RetrievePersonInfoUsecase from '../domain/usecases/RetrievePersonInfoUsecase';
import RevokeSessionsUsecase from '../domain/usecases/RevokeSessionsUsecase';
import UpdateAvatarUsecase from '../domain/usecases/UpdateAvatarUsecase';
import UpdateCustomLearningGoalUsecase from '../domain/usecases/UpdateCustomLearningGoalUsecase';
import UpdateNotificationPermissionUsecase from '../domain/usecases/UpdateNotificationPermissionUsecase';
import UpdateSessionUsecase from '../domain/usecases/UpdateSessionUsecase';
import AddReaderToVocabularyListUsecase from '../domain/usecases/vocabulary/AddReaderToVocabularyListUsecase';
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
    logoUrl: string;
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
    logoUrl,
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
    const getHashtagsFromConversation = new GetHashtagsFromConversationUsecase(chatHttpAdapter);
    const exportMediasFromConversation = new ExportMediasFromConversationUsecase(chatHttpAdapter);

    // Vocabulary
    const addReaderToVocabularyList = new AddReaderToVocabularyListUsecase(domainHttpAdapter);
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
    const getActivityPdf = new GetActivityPdfUsecase(domainHttpAdapter, fileAdapter);
    const deleteActivity = new DeleteActivityUsecase(domainHttpAdapter);

    // Session
    const createSession = new CreateSessionUsecase(domainHttpAdapter);
    const updateSession = new UpdateSessionUsecase(domainHttpAdapter);
    const cancelSession = new CancelSessionUsecase(domainHttpAdapter);

    //News
    const getAllNews = new GetAllNewsUsecase(domainHttpAdapter);

    // Events
    const subscribeToEvent = new SubscribeToEventUsecase(domainHttpAdapter);
    const unsubscribeToEvent = new UnsubscribeToEventUsecase(domainHttpAdapter);
    const getAllEvents = new GetAllEventsUsecase(domainHttpAdapter);
    const getEvent = new GetEventUsecase(domainHttpAdapter);
    // Report
    const updateReportStatus = new UpdateReportStatusUsecase(domainHttpAdapter);
    const getAllReportCategories = new GetAllReportCategoriesUsecase(domainHttpAdapter);
    const getAllReports = new GetAllReportsUsecase(domainHttpAdapter);
    const getReport = new GetReportUsecase(domainHttpAdapter);
    // Custom Learning Goal
    const createCustomLearningGoal = new CreateCustomLearningGoalUsecase(domainHttpAdapter);
    const updateCustomLearningGoal = new UpdateCustomLearningGoalUsecase(domainHttpAdapter);
    const deleteCustomLearningGoal = new DeleteCustomLearningGoalUsecase(domainHttpAdapter);

    // Log entries
    const createLogEntry = new CreateLogEntryUsecase(domainHttpAdapter);
    const updateCustomLogEntry = new UpdateCustomLogEntryUsecase(domainHttpAdapter);
    const getLogEntries = new GetLogEntriesUsecase(domainHttpAdapter);
    const getLogEntriesByDate = new GetLogEntriesByDateUsecase(domainHttpAdapter);
    const shareLogEntries = new ShareLogEntriesUsecase(domainHttpAdapter);
    const unshareLogEntries = new UnshareLogEntriesUsecase(domainHttpAdapter);
    const exportLogEntries = new ExportLogEntriesUsecase(domainHttpAdapter, fileAdapter);
    const updateVisioDuration = new UpdateVisioDurationUsecase(domainHttpAdapter);

    // Edito
    const getEditoByUniversityId = new GetEditoByUniversityIdUsecase(domainHttpAdapter);

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
        getActivityPdf,
        getAllInterestCategories,
        getAllCountries,
        getAllGoals,
        getAllLanguages,
        getAllReportCategories,
        getAllReports,
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
        logoUrl,
        notificationAdapter,
        resetPassword,
        searchMessagesIdsFromConversation,
        exportMediasFromConversation,
        sendMessage,
        updateVisioDuration,
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
        getAllEvents,
        subscribeToEvent,
        unsubscribeToEvent,
        getEvent,
        updateReportStatus,
        getReport,
        createCustomLearningGoal,
        updateCustomLearningGoal,
        deleteCustomLearningGoal,
        createLogEntry,
        updateCustomLogEntry,
        getLogEntries,
        getLogEntriesByDate,
        shareLogEntries,
        unshareLogEntries,
        exportLogEntries,
        addReaderToVocabularyList,
        getHashtagsFromConversation,
        getEditoByUniversityId,
        deleteActivity,
    };
};

export default getConfigContextValue;
