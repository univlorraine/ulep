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

import { Module, Provider } from '@nestjs/common';
import { CronService } from 'src/core/services/CronService';
import {
  CreateCampusUsecase,
  DeleteCampusUsecase,
  GetCampusByIdUsecase,
  GetCampusUsecase,
  UpdateCampusUsecase,
} from 'src/core/usecases/campus';
import { AddUserToCommunityChatUsecase } from 'src/core/usecases/chat/add-user-to-community-chat.usecase';
import { FindAllSuggestedLanguageUsecase } from 'src/core/usecases/language/find-all-suggested-language.usecase';
import {
  CreateOrUpdateLogEntryUsecase,
  ExportLogEntriesUsecase,
  GetAllEntriesForContactUsecase,
  GetAllEntriesForUserByDateUsecase,
  GetAllEntriesForUserGroupedByDatesUsecase,
  GetAllEntriesUsecase,
  ShareLogEntriesUsecase,
  ShareLogForResearchEntriesUsecase,
  UnshareLogEntriesUsecase,
  UnshareLogForResearchEntriesUsecase,
  UpdateCustomLogEntryUsecase,
} from 'src/core/usecases/log-entry';
import { DeleteObjectiveImageUsecase } from 'src/core/usecases/media/delete-objective-image.usecase';
import { UploadObjectiveImageUsecase } from 'src/core/usecases/media/upload-objective-image.usecase';
import { SendMessageNotificationUsecase } from 'src/core/usecases/notifications';
import { UpdateObjectiveUsecase } from 'src/core/usecases/objective/update-objective.usecase';
import { TokenForAdminUsecase } from 'src/core/usecases/security/token-for-admin.usecase';
import { GetVocabularyListPdfUsecase } from 'src/core/usecases/vocabulary/get-vocabulary-list-pdf.usecase';
import { ProvidersModule } from 'src/providers/providers.module';
import { MatchScorer } from './services/MatchScorer';
import {
  AddDeviceUsecase,
  AddLanguageRequestUsecase,
  AddReaderToVocabularyListUsecase,
  CountAllSuggestedLanguageUsecase,
  CreateActivityThemeCategoryUsecase,
  CreateActivityThemeUsecase,
  CreateActivityUsecase,
  CreateAdministratorUsecase,
  CreateCommunityChatUsecase,
  CreateInterestCategoryUsecase,
  CreateInterestUsecase,
  CreateLearningLanguageUseCase,
  CreateNewsUsecase,
  CreateObjectiveUsecase,
  CreateOrUpdateTestedLanguageUsecase,
  CreatePartnerUniversityUsecase,
  CreateProfileUsecase,
  CreateQuestionUsecase,
  CreateReportCategoryUsecase,
  CreateReportMessageUsecase,
  CreateReportUsecase,
  CreateTandemUsecase,
  CreateTestUsecase,
  CreateUniversityUsecase,
  CreateUnsubscribeReportUsecase,
  CreateUserUsecase,
  CreateVocabularyListUsecase,
  CreateVocabularyUsecase,
  DeleteActivityThemeCategoryUsecase,
  DeleteActivityThemeUsecase,
  DeleteActivityUsecase,
  DeleteAdministratorUsecase,
  DeleteAudioVocabularyActivityUsecase,
  DeleteAudioVocabularyUsecase,
  DeleteAvatarUsecase,
  DeleteImageActivityUsecase,
  DeleteInterestCategoryUsecase,
  DeleteInterestUsecase,
  DeleteMediaActivityUsecase,
  DeleteNewsImageUsecase,
  DeleteNewsUsecase,
  DeleteObjectiveUsecase,
  DeleteProfileUsecase,
  DeleteQuestionUsecase,
  DeleteReportCategoryUsecase,
  DeleteReportUsecase,
  DeleteTestUsecase,
  DeleteUniversityUsecase,
  DeleteUserUsecase,
  DeleteVocabularyActivityUsecase,
  DeleteVocabularyListUsecase,
  DeleteVocabularyUsecase,
  FindAllLanguageCodeUsecase,
  FindAllObjectiveUsecase,
  FindAllVocabularyFromListIdUsecase,
  FindAllVocabularyFromSelectedListsIdUsecase,
  FindAllVocabularyListUsecase,
  FindOneObjectiveUsecase,
  GenerateCertificateUsecase,
  GenerateConversationsUsecase,
  GenerateEditosUsecase,
  GenerateTandemsUsecase,
  GetActivitiesUsecase,
  GetActivityPdfUsecase,
  GetActivityThemeCategoryUsecase,
  GetActivityThemeUsecase,
  GetActivityUsecase,
  GetAdministratorsUsecase,
  GetAdministratorUsecase,
  GetAllActivitiesByAdminUsecase,
  GetAllActivityThemesUsecase,
  GetAllConversationsFromUserIdUsecase,
  GetCategoriesUsecase,
  GetCountriesUniversitiesUsecase,
  GetCountriesUsecase,
  GetEditoByUniversityIdUsecase,
  GetEditosUsecase,
  GetEditoUsecase,
  GetInstanceUsecase,
  GetInterestCategoryUsecase,
  GetInterestsByCategoriesUsecase,
  GetInterestUsecase,
  GetLanguageUsecase,
  GetLearningLanguageMatchesUsecase,
  GetLearningLanguageOfIdUsecase,
  GetLearningLanguageOfProfileUsecase,
  GetLearningLanguagesUsecase,
  GetLevelsUsecase,
  GetMediaObjectUsecase,
  GetMessagesFromConversationUsecase,
  GetNewsAdminUsecase,
  GetNewsUsecase,
  GetOneNewsUsecase,
  GetOtherUserEmailInTandemUsecase,
  GetPartnersToUniversityUsecase,
  GetProfileByUserIdUsecase,
  GetProfilesUsecase,
  GetProfilesWithTandemsProfilesUsecase,
  GetProfileUsecase,
  GetProfileWithTandemsProfilesUsecase,
  GetQuestionsByLevelUsecase,
  GetQuestionsUsecase,
  GetQuestionUsecase,
  GetReportCategoryByIdUsecase,
  GetReportsByStatusUsecase,
  GetReportUsecase,
  GetTandemsByIdsUsecase,
  GetTandemsForProfileUsecase,
  GetTandemsUsecase,
  GetTestsUsecase,
  GetTestUsecase,
  GetUniversitiesUsecase,
  GetUniversityDivisionsUsecase,
  GetUniversityUsecase,
  GetUserPersonalData,
  GetUsersUsecase,
  GetUserUsecase,
  RefuseTandemUsecase,
  RemoveReaderToVocabularyListUsecase,
  UpdateActivityThemeCategoryUsecase,
  UpdateActivityThemeUsecase,
  UpdateActivityUsecase,
  UpdateAdministratorUsecase,
  UpdateCountryStatusUsecase,
  UpdateEditoUsecase,
  UpdateInstanceUsecase,
  UpdateInterestCategoryUsecase,
  UpdateInterestUsecase,
  UpdateLanguageCodeUsecase,
  UpdateLearningLanguageUsecase,
  UpdateNewsUsecase,
  UpdateProfileUsecase,
  UpdateQuestionUsecase,
  UpdateReportCategoryUsecase,
  UpdateReportStatusUsecase,
  UpdateTandemUsecase,
  UpdateUniversityUsecase,
  UpdateUserUsecase,
  UpdateVocabularyListUsecase,
  UpdateVocabularyUsecase,
  UploadAdminAvatarUsecase,
  UploadAudioVocabularyActivityUsecase,
  UploadAudioVocabularyUsecase,
  UploadAvatarUsecase,
  UploadEditoImageUsecase,
  UploadEventImageUsecase,
  UploadImageActivityUsecase,
  UploadLearningLanguageCertificateUsecase,
  UploadMediaActivityUsecase,
  UploadNewsImageUsecase,
  UploadUniversityImageUsecase,
} from './usecases';
import { CountActivitiesUsecase } from './usecases/activity/count-activities.usecase';
import { UpdateActivityStatusUsecase } from './usecases/activity/update-activity-status.usecase';
import {
  CreateEventUsecase,
  DeleteEventUsecase,
  GetEventsAdminUsecase,
  GetEventsUsecase,
  GetEventUsecase,
  SendEmailToSubscribedUsersUsecase,
  SubscribeToEventUsecase,
  UnsubscribeToEventUsecase,
  UpdateEventUsecase,
} from './usecases/event';
import { GetJitsiTokenUsecase } from './usecases/jitsi/get-jitsi-token.usecase';
import { DeleteLearningLanguageUsecase } from './usecases/learningLanguage/delete-learning-langugage.usecase';
import { GetLearningLanguageTandemUsecase } from './usecases/learningLanguage/getLearningLanguageTandem.usecase';
import { UpdateVisioDurationUsecase } from './usecases/learningLanguage/update-visio-duration.usecase';
import { UploadInstanceDefaultCertificateUsecase } from './usecases/media/upload-instance-default-certificate.usecase';
import { UploadUniversityDefaultCertificateUsecase } from './usecases/media/upload-university-default-certificate.usecase';
import { CreateCustomLearningGoalUsecase } from './usecases/objective/create-custom-learning-goals.usecase';
import { DeleteCustomLearningGoalUsecase } from './usecases/objective/delete-custom-learning-goal.usecase';
import { UpdateCustomLearningGoalUsecase } from './usecases/objective/update-custom-learning-goal.usecase';
import { ArchiveTandemsAndDeleteUsersUsecase } from './usecases/purges/archive-tandems.usecase';
import { GetReportsByUserUsecase } from './usecases/report/get-reports-by-user.usecase';
import { LogoutAllSessionsUsecase } from './usecases/security/logout-all-sessions.usecase';
import { ResetAdminPasswordUsecase } from './usecases/security/reset-admin-password.usecase';
import { ResetPasswordUsecase } from './usecases/security/reset-password.usecase';
import { CancelSessionUsecase } from './usecases/session/cancel-session.usecase';
import { CreateSessionUsecase } from './usecases/session/create-session.usecase';
import { GetSessionsForProfileUsecase } from './usecases/session/get-sessions-for-profile.usecase';
import { UpdateSessionUsecase } from './usecases/session/update-session.usecase';
import { ValidateTandemUsecase } from './usecases/tandem/validate-tandem.usecase';
import { GetKeycloakAdminGroupsUsecase } from './usecases/user/get-keycloak-admin-groups.usecase';
import { RevokeSessionsUsecase } from './usecases/user/revoke-sessions.usecase';
import { CountVocabulariesUsecase } from './usecases/vocabulary/count-vocabularies.usecase';

const usecases: Provider[] = [
  // Activity
  CreateActivityUsecase,
  GetAllActivityThemesUsecase,
  GetActivityUsecase,
  GetActivitiesUsecase,
  GetActivityThemeCategoryUsecase,
  CreateActivityThemeCategoryUsecase,
  CreateActivityThemeUsecase,
  GetActivityThemeUsecase,
  DeleteActivityUsecase,
  DeleteActivityThemeCategoryUsecase,
  DeleteActivityThemeUsecase,
  DeleteVocabularyActivityUsecase,
  UpdateActivityThemeCategoryUsecase,
  UpdateActivityThemeUsecase,
  UpdateActivityUsecase,
  UpdateActivityStatusUsecase,
  GetAllActivitiesByAdminUsecase,
  GetActivityPdfUsecase,
  CountActivitiesUsecase,
  //Campus
  CreateCampusUsecase,
  DeleteCampusUsecase,
  GetCampusUsecase,
  GetCampusByIdUsecase,
  UpdateCampusUsecase,
  // Countries
  GetCountriesUsecase,
  GetCountriesUniversitiesUsecase,
  UpdateCountryStatusUsecase,
  // Edito
  GenerateEditosUsecase,
  GetEditoByUniversityIdUsecase,
  GetEditosUsecase,
  GetEditoUsecase,
  UpdateEditoUsecase,
  // Interest
  CreateInterestCategoryUsecase,
  CreateInterestUsecase,
  DeleteInterestCategoryUsecase,
  DeleteInterestUsecase,
  GetInterestsByCategoriesUsecase,
  GetInterestUsecase,
  GetInterestCategoryUsecase,
  UpdateInterestCategoryUsecase,
  UpdateInterestUsecase,
  // Languages
  AddLanguageRequestUsecase,
  CountAllSuggestedLanguageUsecase,
  FindAllLanguageCodeUsecase,
  FindAllSuggestedLanguageUsecase,
  UpdateLanguageCodeUsecase,
  GetLanguageUsecase,
  // Media
  GetMediaObjectUsecase,
  DeleteAudioVocabularyUsecase,
  DeleteObjectiveImageUsecase,
  DeleteMediaActivityUsecase,
  DeleteImageActivityUsecase,
  DeleteAudioVocabularyActivityUsecase,
  UploadAvatarUsecase,
  UploadAdminAvatarUsecase,
  UploadObjectiveImageUsecase,
  UploadUniversityImageUsecase,
  UploadAudioVocabularyUsecase,
  UploadImageActivityUsecase,
  UploadAudioVocabularyActivityUsecase,
  UploadMediaActivityUsecase,
  UploadInstanceDefaultCertificateUsecase,
  UploadUniversityDefaultCertificateUsecase,
  UploadLearningLanguageCertificateUsecase,
  UploadEventImageUsecase,
  UploadEditoImageUsecase,
  // News
  GetNewsAdminUsecase,
  GetNewsUsecase,
  GetOneNewsUsecase,
  CreateNewsUsecase,
  UpdateNewsUsecase,
  DeleteNewsUsecase,
  UploadNewsImageUsecase,
  DeleteNewsImageUsecase,
  // Objectives
  CreateObjectiveUsecase,
  DeleteObjectiveUsecase,
  FindAllObjectiveUsecase,
  FindOneObjectiveUsecase,
  UpdateObjectiveUsecase,
  // Proficiency
  CreateQuestionUsecase,
  CreateTestUsecase,
  DeleteQuestionUsecase,
  DeleteTestUsecase,
  GetQuestionUsecase,
  GetQuestionsUsecase,
  GetQuestionsByLevelUsecase,
  GetLevelsUsecase,
  GetTestUsecase,
  GetTestsUsecase,
  UpdateQuestionUsecase,
  // Reports
  CreateUnsubscribeReportUsecase,
  CreateReportCategoryUsecase,
  CreateReportUsecase,
  CreateReportMessageUsecase,
  DeleteReportCategoryUsecase,
  DeleteReportUsecase,
  GetCategoriesUsecase,
  GetReportCategoryByIdUsecase,
  GetReportUsecase,
  GetReportsByStatusUsecase,
  GetReportsByUserUsecase,
  UpdateReportStatusUsecase,
  UpdateReportCategoryUsecase,
  // Profiles
  CreateOrUpdateTestedLanguageUsecase,
  CreateProfileUsecase,
  GetTandemsForProfileUsecase,
  GetProfileByUserIdUsecase,
  GetProfilesUsecase,
  GetProfilesWithTandemsProfilesUsecase,
  GetProfileWithTandemsProfilesUsecase,
  GetProfileUsecase,
  DeleteAvatarUsecase,
  DeleteProfileUsecase,
  CreateLearningLanguageUseCase,
  UpdateProfileUsecase,
  // LearningLanguages
  GetLearningLanguagesUsecase,
  GetLearningLanguageOfIdUsecase,
  GetLearningLanguageOfProfileUsecase,
  GetLearningLanguageTandemUsecase,
  DeleteLearningLanguageUsecase,
  UpdateLearningLanguageUsecase,
  GenerateCertificateUsecase,
  UpdateVisioDurationUsecase,
  // History Tandem
  GetOtherUserEmailInTandemUsecase,
  // Tandems
  CreateTandemUsecase,
  GenerateTandemsUsecase,
  GetTandemsUsecase,
  GetTandemsByIdsUsecase,
  GetLearningLanguageMatchesUsecase,
  ValidateTandemUsecase,
  RefuseTandemUsecase,
  UpdateTandemUsecase,
  // Universities
  CreatePartnerUniversityUsecase,
  CreateUniversityUsecase,
  DeleteUniversityUsecase,
  GetPartnersToUniversityUsecase,
  GetUniversitiesUsecase,
  GetUniversityUsecase,
  UpdateUniversityUsecase,
  GetUniversityDivisionsUsecase,
  // Users
  AddDeviceUsecase,
  CreateAdministratorUsecase,
  CreateUserUsecase,
  DeleteAdministratorUsecase,
  DeleteUserUsecase,
  GetAdministratorUsecase,
  GetAdministratorsUsecase,
  GetUsersUsecase,
  GetUserUsecase,
  UpdateUserUsecase,
  UpdateAdministratorUsecase,
  ArchiveTandemsAndDeleteUsersUsecase,
  RevokeSessionsUsecase,
  GetUserPersonalData,
  GetKeycloakAdminGroupsUsecase,
  // Instance
  GetInstanceUsecase,
  UpdateInstanceUsecase,
  // Security
  ResetPasswordUsecase,
  ResetAdminPasswordUsecase,
  GetJitsiTokenUsecase,
  LogoutAllSessionsUsecase,
  TokenForAdminUsecase,
  // Notifications
  SendMessageNotificationUsecase,
  // Chat
  AddUserToCommunityChatUsecase,
  GenerateConversationsUsecase,
  GetAllConversationsFromUserIdUsecase,
  GetMessagesFromConversationUsecase,
  CreateCommunityChatUsecase,
  // Vocabulary
  CreateVocabularyUsecase,
  CreateVocabularyListUsecase,
  DeleteVocabularyUsecase,
  DeleteVocabularyListUsecase,
  FindAllVocabularyFromListIdUsecase,
  FindAllVocabularyListUsecase,
  FindAllVocabularyFromSelectedListsIdUsecase,
  UpdateVocabularyUsecase,
  UpdateVocabularyListUsecase,
  GetVocabularyListPdfUsecase,
  AddReaderToVocabularyListUsecase,
  RemoveReaderToVocabularyListUsecase,
  CountVocabulariesUsecase,
  // Session
  CancelSessionUsecase,
  CreateSessionUsecase,
  GetSessionsForProfileUsecase,
  UpdateSessionUsecase,
  // Event
  CreateEventUsecase,
  DeleteEventUsecase,
  GetEventsAdminUsecase,
  GetEventsUsecase,
  GetEventUsecase,
  UpdateEventUsecase,
  SubscribeToEventUsecase,
  UnsubscribeToEventUsecase,
  SendEmailToSubscribedUsersUsecase,
  // Custom Learning Goals
  CreateCustomLearningGoalUsecase,
  UpdateCustomLearningGoalUsecase,
  DeleteCustomLearningGoalUsecase,
  // Log Entry
  CreateOrUpdateLogEntryUsecase,
  GetAllEntriesForUserByDateUsecase,
  GetAllEntriesForUserGroupedByDatesUsecase,
  UpdateCustomLogEntryUsecase,
  ShareLogEntriesUsecase,
  UnshareLogEntriesUsecase,
  ShareLogForResearchEntriesUsecase,
  UnshareLogForResearchEntriesUsecase,
  ExportLogEntriesUsecase,
  GetAllEntriesForContactUsecase,
  GetAllEntriesUsecase,
];

const services: Provider[] = [MatchScorer, CronService];

@Module({
  imports: [ProvidersModule],
  providers: [...usecases, ...services],
  exports: [...usecases, ...services],
})
export class CoreModule {}
