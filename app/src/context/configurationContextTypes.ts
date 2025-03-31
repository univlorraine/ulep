/**
 *
 *   Copyright ou © ou Copr. Université de Lorraine, (2025)
 *
 *   Direction du Numérique de l'Université de Lorraine - SIED
 *
 *   Ce logiciel est un programme informatique servant à rendre accessible
 *   sur mobile et sur internet l'application ULEP (University Language
 *   Exchange Programme) aux étudiants et aux personnels des universités
 *   parties prenantes.
 *
 *   Ce logiciel est régi par la licence CeCILL 2.1, soumise au droit français
 *   et respectant les principes de diffusion des logiciels libres. Vous pouvez
 *   utiliser, modifier et/ou redistribuer ce programme sous les conditions
 *   de la licence CeCILL telle que diffusée par le CEA, le CNRS et INRIA
 *   sur le site "http://cecill.info".
 *
 *   En contrepartie de l'accessibilité au code source et des droits de copie,
 *   de modification et de redistribution accordés par cette licence, il n'est
 *   offert aux utilisateurs qu'une garantie limitée. Pour les mêmes raisons,
 *   seule une responsabilité restreinte pèse sur l'auteur du programme, le
 *   titulaire des droits patrimoniaux et les concédants successifs.
 *
 *   À cet égard, l'attention de l'utilisateur est attirée sur les risques
 *   associés au chargement, à l'utilisation, à la modification et/ou au
 *   développement et à la reproduction du logiciel par l'utilisateur étant
 *   donné sa spécificité de logiciel libre, qui peut le rendre complexe à
 *   manipuler et qui le réserve donc à des développeurs et des professionnels
 *   avertis possédant des connaissances informatiques approfondies. Les
 *   utilisateurs sont donc invités à charger et à tester l'adéquation du
 *   logiciel à leurs besoins dans des conditions permettant d'assurer la
 *   sécurité de leurs systèmes et/ou de leurs données et, plus généralement,
 *   à l'utiliser et à l'exploiter dans les mêmes conditions de sécurité.
 *
 *   Le fait que vous puissiez accéder à cet en-tête signifie que vous avez
 *   pris connaissance de la licence CeCILL 2.1, et que vous en avez accepté les
 *   termes.
 *
 */

import BrowserAdapterInterface from '../adapter/interfaces/BrowserAdapter.interface';
import CameraAdapterInterface from '../adapter/interfaces/CameraAdapter.interface';
import DeviceAdapterInterface from '../adapter/interfaces/DeviceAdapter.interface';
import FileAdapterInterface from '../adapter/interfaces/FileAdapter.interface';
import NotificationAdapterInterface from '../adapter/interfaces/NotificationAdapter.interface';
import RecorderAdapterInterface from '../adapter/interfaces/RecorderAdapter.interface';
import Configuration from '../domain/entities/Confirguration';
import CreateActivityUsecaseInterface from '../domain/interfaces/activity/CreateActivityUsecase.interface';
import DeleteActivityUsecaseInterface from '../domain/interfaces/activity/DeleteActivityUsecase.interface';
import GetActivitiesUsecaseInterface from '../domain/interfaces/activity/GetActivitiesUsecase.interface';
import GetActivityPdfUsecaseInterface from '../domain/interfaces/activity/GetActivityPdfUsecase.interface';
import GetActivityThemesUsecaseInterface from '../domain/interfaces/activity/GetActivityThemesUsecase.interface';
import GetActivityUsecaseInterface from '../domain/interfaces/activity/GetActivityUsecase.interface';
import UpdateActivityStatusUsecaseInterface from '../domain/interfaces/activity/UpdateActivityStatusUsecase.interface';
import UpdateActivityUsecaseInterface from '../domain/interfaces/activity/UpdateActivityUsecase.interface';
import AddDeviceUsecaseInterface from '../domain/interfaces/AddDeviceUsecase.interface';
import AskForAccountDeletionUsecaseInterface from '../domain/interfaces/AskForAccountDeletionUsecase.interface';
import AskForLanguageUsecaseInterface from '../domain/interfaces/AskForLanguageUsecase.interface';
import AskForLearningLanguageUsecaseInterface from '../domain/interfaces/AskForLearningLanguageUsecase.interface';
import GetInitialUrlUsecaseInterface from '../domain/interfaces/AuthStandardFlow/GetInitialUrlUsecase.interface';
import GetTokenFromCodeUsecaseInterface from '../domain/interfaces/AuthStandardFlow/GetTokenFromCodeUsecase.interface';
import CancelSessionUsecaseInterface from '../domain/interfaces/CancelSessionUsecase.interface';
import ExportMediasFromConversationUsecaseInterface from '../domain/interfaces/chat/ExportMediasFromConversationUsecase.interface';
import GetConversationsUsecaseInterface from '../domain/interfaces/chat/GetConversationsUsecase.interface';
import GetHashtagsFromConversationUsecaseInterface from '../domain/interfaces/chat/GetHashtagsFromConversationUsecase.interface';
import GetMessagesFromConversationUsecaseInterface from '../domain/interfaces/chat/GetMessagesFromConversationUsecase.interface';
import SearchMessagesIdsFromConversationUsecaseInterface from '../domain/interfaces/chat/SearchMessagesIdsFromConversationUsecase.interface';
import SendMessageUsecaseInterface from '../domain/interfaces/chat/SendMessageUsecase.interface';
import CreateCustomLearningGoalUsecaseInterface from '../domain/interfaces/CreateCustomLearningGoal.interface';
import CreateOrUpdateTestedLanguageUsecaseInterface from '../domain/interfaces/CreateOrUpdateTestedLanguageUsecase.interface';
import CreateProfileUsecaseInterface from '../domain/interfaces/CreateProfileUsecase.interface';
import CreateReportMessageUsecaseInterface from '../domain/interfaces/CreateReportMessageUsecase.interface';
import CreateReportUsecaseInterface from '../domain/interfaces/CreateReportUsecase.interface';
import CreateSessionUsecaseInterface from '../domain/interfaces/CreateSessionUsecase.interface';
import CreateUserUsecaseInterface from '../domain/interfaces/CreateUserUsecase.interface';
import DeleteCustomLearningGoalUsecaseInterface from '../domain/interfaces/DeleteCustomLearningGoalUsecae.interface';
import EditProfileUsecaseInterface from '../domain/interfaces/EditProfileUsecase.interface';
import EditUserUsecaseInterface from '../domain/interfaces/EditUserUsecase.interface';
import GetAllEventsUsecaseInterface from '../domain/interfaces/event/GetAllEventsUsecase.interface';
import GetEventUsecaseInterface from '../domain/interfaces/event/GetEventUsecase.interface';
import SubscribeToEventUsecaseInterface from '../domain/interfaces/event/SubscribeToEventUsecase.interface';
import UnsubscribeToEventUsecaseInterface from '../domain/interfaces/event/UnsubscribeToEventUsecase.interface';
import GetAllCountriesUsecaseInterface from '../domain/interfaces/GetAllCountriesUsecase.interface';
import GetAllGoalsUsecaseInterface from '../domain/interfaces/GetAllGoalsUsecase.interface';
import GetAllInterestCategoriessUsecase from '../domain/interfaces/GetAllInterestCategoriesUsecase.interface';
import GetAllLanguagesUsecaseInterface from '../domain/interfaces/GetAllLanguagesUsecase.interface';
import GetAllSessionsUsecaseInterface from '../domain/interfaces/GetAllSessionsUsecase.interface';
import GetAllTandemsUsecaseInterface from '../domain/interfaces/GetAllTandemsUsecase.interface';
import GetAllUniversitiesUsecaseInterface from '../domain/interfaces/GetAllUniversitiesUsecase.interface';
import GetEditoByUniversityIdUsecaseInterface from '../domain/interfaces/GetEditoByUniversityIdUsecase.interface';
import GetHistoricEmailPartnerUsecaseInterface from '../domain/interfaces/GetHistoricEmailPartnerUsecase.interface';
import GetJitsiTokenUsecaseInterface from '../domain/interfaces/GetJitsiTokenUsecase.interface';
import GetMediaObjectUsecaseInterface from '../domain/interfaces/GetMediaObjectUsecase.interface';
import GetPartnersToUniversityUsecaseInterface from '../domain/interfaces/GetPartnersToUniversityUsecase.interface';
import GetProfileUsecaseInterface from '../domain/interfaces/GetProfileUsecase.interface';
import GetQuizzByLevelUsecaseInterface from '../domain/interfaces/GetQuizzByLevelUsecase.interface';
import GetUniversityInterface from '../domain/interfaces/GetUniversity.interface';
import GetUniversityLanguagesUsecaseInterface from '../domain/interfaces/GetUniversityLanguagesUsecase.interface';
import GetUserUsecaseInterface from '../domain/interfaces/GetUserUsecase.interface';
import CreateLogEntryUsecaseInterface from '../domain/interfaces/log-entries/CreateLogEntryUsecase.interface';
import ExportLogEntriesUsecaseInterface from '../domain/interfaces/log-entries/ExportLogEntriesUsecase.interface';
import GetLogEntriesByDateUsecaseInterface from '../domain/interfaces/log-entries/GetLogEntriesByDateUsecase.interface';
import GetLogEntriesUsecaseInterface from '../domain/interfaces/log-entries/GetLogEntriesUsecase.interface';
import ShareLogEntriesUsecaseInterface from '../domain/interfaces/log-entries/ShareLogEntriesUsecase.interface';
import UnshareLogEntriesUsecaseInterface from '../domain/interfaces/log-entries/UnshareLogEntriesUsecase.interface';
import UpdateCustomLogEntryUsecaseInterface from '../domain/interfaces/log-entries/UpdateCustomLogEntryUsecase.interface';
import UpdateVisioDurationUsecaseInterface from '../domain/interfaces/log-entries/UpdateVisioDurationUsecase.interface';
import LoginUsecaseInterface from '../domain/interfaces/LoginUsecase.interface';
import GetAllNewsUsecaseInterface from '../domain/interfaces/news/GetAllNewsUsecase.interface';
import RefreshTokensUsecaseInterface from '../domain/interfaces/RefreshTokensUsecase.interface';
import GetAllReportCategoriesUsecaseInterface from '../domain/interfaces/reports/GetAllReportCategoriesUsecase.interface';
import GetAllReportsUsecaseInterface from '../domain/interfaces/reports/GetAllReportsUsecase.interface';
import GetReportUsecaseInterface from '../domain/interfaces/reports/GetReportUsecase.interface';
import UpdateReportStatusUsecaseInterface from '../domain/interfaces/reports/UpdateReportStatusUsecase.interface';
import ResetPasswordUsecaseInterface from '../domain/interfaces/ResetPasswordUsecase.interface';
import RetrievePersonInfoUsecaseInterface from '../domain/interfaces/RetrievePersonInfoUsecase.interface';
import RevokeSessionsUsecaseInterface from '../domain/interfaces/RevokeSessionsUsecase.interface';
import UpdateAvatarUsecaseInterface from '../domain/interfaces/UpdateAvatarUsecase.interface';
import UpdateCustomLearningGoalUsecaseInterface from '../domain/interfaces/UpdateCustomLearningGoal.interface';
import UpdateNotificationPermissionUsecaseInterface from '../domain/interfaces/UpdateNotificationPermissionUsecase.interface';
import UpdateSessionUsecaseInterface from '../domain/interfaces/UpdateSessionUsecase.interface';
import AddReaderToVocabularyListUsecaseInterface from '../domain/interfaces/vocabulary/AddReaderToVocabularyListUsecase.interface';
import CreateVocabularyListUsecaseInterface from '../domain/interfaces/vocabulary/CreateVocabularyListUsecase.interface';
import CreateVocabularyUsecaseInterface from '../domain/interfaces/vocabulary/CreateVocabularyUsecase.interface';
import DeleteVocabularyListUsecaseInterface from '../domain/interfaces/vocabulary/DeleteVocabularyListUsecase.interface';
import DeleteVocabularyUsecaseInterface from '../domain/interfaces/vocabulary/DeleteVocabularyUsecase.interface';
import GetVocabulariesFromListsIdUsecaseInterface from '../domain/interfaces/vocabulary/GetVocabulariesFromListsIdUsecase.interface';
import GetVocabulariesUsecaseInterface from '../domain/interfaces/vocabulary/GetVocabulariesUsecase.interface';
import GetVocabularyListPdfUsecaseInterface from '../domain/interfaces/vocabulary/GetVocabularyListPdfUsecase.interface';
import GetVocabularyListsUsecaseInterface from '../domain/interfaces/vocabulary/GetVocabularyListsUsecase.interface';
import UpdateVocabularyListUsecaseInterface from '../domain/interfaces/vocabulary/UpdateVocabularyListUsecase.interface';
import UpdateVocabularyUsecaseInterface from '../domain/interfaces/vocabulary/UpdateVocabularyUsecase.interface';
export interface ConfigContextValueType {
    accessToken: string;
    addDevice: AddDeviceUsecaseInterface;
    askForAccountDeletion: AskForAccountDeletionUsecaseInterface;
    askForLanguage: AskForLanguageUsecaseInterface;
    askForLearningLanguage: AskForLearningLanguageUsecaseInterface;
    browserAdapter: BrowserAdapterInterface;
    cameraAdapter: CameraAdapterInterface;
    deviceAdapter: DeviceAdapterInterface;
    recorderAdapter: RecorderAdapterInterface;
    configuration: Configuration;
    createProfile: CreateProfileUsecaseInterface;
    createReport: CreateReportUsecaseInterface;
    createReportMessage: CreateReportMessageUsecaseInterface;
    createOrUpdateTestedLanguage: CreateOrUpdateTestedLanguageUsecaseInterface;
    createUser: CreateUserUsecaseInterface;
    fileAdapter: FileAdapterInterface;
    editProfile: EditProfileUsecaseInterface;
    editUser: EditUserUsecaseInterface;
    getAllCountries: GetAllCountriesUsecaseInterface;
    getAllGoals: GetAllGoalsUsecaseInterface;
    getAllInterestCategories: GetAllInterestCategoriessUsecase;
    getAllLanguages: GetAllLanguagesUsecaseInterface;
    getAllTandems: GetAllTandemsUsecaseInterface;
    getAllSessions: GetAllSessionsUsecaseInterface;
    getAllUniversities: GetAllUniversitiesUsecaseInterface;
    getConversations: GetConversationsUsecaseInterface;
    getHistoricEmailPartner: GetHistoricEmailPartnerUsecaseInterface;
    getMediaObject: GetMediaObjectUsecaseInterface;
    getMessagesFromConversation: GetMessagesFromConversationUsecaseInterface;
    exportMediasFromConversation: ExportMediasFromConversationUsecaseInterface;
    getPartnersToUniversity: GetPartnersToUniversityUsecaseInterface;
    getProfile: GetProfileUsecaseInterface;
    getJitsiToken: GetJitsiTokenUsecaseInterface;
    getQuizzByLevel: GetQuizzByLevelUsecaseInterface;
    getUser: GetUserUsecaseInterface;
    getUniversity: GetUniversityInterface;
    getUniversityLanguages: GetUniversityLanguagesUsecaseInterface;
    login: LoginUsecaseInterface;
    logoUrl: string;
    notificationAdapter: NotificationAdapterInterface;
    resetPassword: ResetPasswordUsecaseInterface;
    getHashtagsFromConversation: GetHashtagsFromConversationUsecaseInterface;
    sendMessage: SendMessageUsecaseInterface;
    searchMessagesIdsFromConversation: SearchMessagesIdsFromConversationUsecaseInterface;
    updateAvatar: UpdateAvatarUsecaseInterface;
    updateNotificationPermission: UpdateNotificationPermissionUsecaseInterface;
    retrievePerson: RetrievePersonInfoUsecaseInterface;
    getTokenFromCodeUsecase: GetTokenFromCodeUsecaseInterface;
    getInitialUrlUsecase: GetInitialUrlUsecaseInterface;
    revokeSessionsUsecase: RevokeSessionsUsecaseInterface;
    refreshTokensUsecase: RefreshTokensUsecaseInterface;
    // Activity
    createActivity: CreateActivityUsecaseInterface;
    getActivities: GetActivitiesUsecaseInterface;
    getActivity: GetActivityUsecaseInterface;
    getActivityThemes: GetActivityThemesUsecaseInterface;
    updateActivity: UpdateActivityUsecaseInterface;
    updateActivityStatus: UpdateActivityStatusUsecaseInterface;
    getActivityPdf: GetActivityPdfUsecaseInterface;
    deleteActivity: DeleteActivityUsecaseInterface;
    // Vocabulary
    addReaderToVocabularyList: AddReaderToVocabularyListUsecaseInterface;
    createVocabulary: CreateVocabularyUsecaseInterface;
    updateVocabulary: UpdateVocabularyUsecaseInterface;
    deleteVocabulary: DeleteVocabularyUsecaseInterface;
    getVocabularies: GetVocabulariesUsecaseInterface;
    getVocabulariesFromListsIdUsecase: GetVocabulariesFromListsIdUsecaseInterface;
    getVocabularyListPdf: GetVocabularyListPdfUsecaseInterface;
    createVocabularyList: CreateVocabularyListUsecaseInterface;
    updateVocabularyList: UpdateVocabularyListUsecaseInterface;
    deleteVocabularyList: DeleteVocabularyListUsecaseInterface;
    getVocabularyLists: GetVocabularyListsUsecaseInterface;
    // Session
    createSession: CreateSessionUsecaseInterface;
    updateSession: UpdateSessionUsecaseInterface;
    cancelSession: CancelSessionUsecaseInterface;
    // News
    getAllNews: GetAllNewsUsecaseInterface;
    // Events
    getAllEvents: GetAllEventsUsecaseInterface;
    getEvent: GetEventUsecaseInterface;
    subscribeToEvent: SubscribeToEventUsecaseInterface;
    unsubscribeToEvent: UnsubscribeToEventUsecaseInterface;
    // Report
    updateReportStatus: UpdateReportStatusUsecaseInterface;
    getAllReportCategories: GetAllReportCategoriesUsecaseInterface;
    getAllReports: GetAllReportsUsecaseInterface;
    getReport: GetReportUsecaseInterface;
    // Custom goal
    createCustomLearningGoal: CreateCustomLearningGoalUsecaseInterface;
    updateCustomLearningGoal: UpdateCustomLearningGoalUsecaseInterface;
    deleteCustomLearningGoal: DeleteCustomLearningGoalUsecaseInterface;
    // Log entries
    createLogEntry: CreateLogEntryUsecaseInterface;
    updateCustomLogEntry: UpdateCustomLogEntryUsecaseInterface;
    getLogEntries: GetLogEntriesUsecaseInterface;
    getLogEntriesByDate: GetLogEntriesByDateUsecaseInterface;
    shareLogEntries: ShareLogEntriesUsecaseInterface;
    unshareLogEntries: UnshareLogEntriesUsecaseInterface;
    exportLogEntries: ExportLogEntriesUsecaseInterface;
    updateVisioDuration: UpdateVisioDurationUsecaseInterface;
    // Edito
    getEditoByUniversityId: GetEditoByUniversityIdUsecaseInterface;
}
