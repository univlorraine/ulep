import { Module, Provider } from '@nestjs/common';
import { CreateUserUsecase } from './usecases/users/create-user.usecase';
import { ProvidersModule } from '../providers/providers.module';
import { UploadImageUsecase } from './usecases/uploads/upload-image.usecase';
import { ResetPasswordUsecase } from './usecases/users/reset-password.usecase';
import { CreateUniversityUsecase } from './usecases/universities/create-university.usecase';
import { GetUniversitiesUsecase } from './usecases/universities/get-universities.usecase';
import { DeleteUniversityUsecase } from './usecases/universities/delete-university.usecase';
import { GetUniversityUsecase } from './usecases/universities/get-university.usecase';
import { GetUsersUsecase } from './usecases/users/get-users.usecase';
import { GetProfilesUsecase } from './usecases/profiles/get-profiles.usecase';
import { GetProfileUsecase } from './usecases/profiles/get-profile.usecase';
import { CreateProfileUsecase } from './usecases/profiles/create-profile.usecase';
import { CreateLanguageUsecase } from './usecases/languages/create-language.usecase';
import { GetLanguagesUsecase } from './usecases/languages/get-languages.usecase';
import { UpdateLanguageUsecase } from './usecases/languages/update-language.usecase';
import { UpdateProfileUsecase } from './usecases/profiles/update-profile.usecase';
import { DeleteProfileUsecase } from './usecases/profiles/delete-profile.usecase';
import { GetUserUsecase } from './usecases/users/get-user.usecase';
import { GetTokensUsecase } from './usecases/tokens/get-tokens.usecase';
import { RefreshTokensUsecase } from './usecases/tokens/refresh-tokens.usecase';
import { MatchScorer } from './services/matchs/MatchScorer';
import { KeycloakAuthenticator } from './services/authentication/authenticator';
import { GetMatchsByProfileIdUsecase } from './usecases/matchs/GetMatchsByProfileId';
import { GetLanguageUsecase } from './usecases/languages/get-language.usecase';
import {
  CreateReportCategoryUsecase,
  CreateReportUsecase,
  DeleteReportUsecase,
  GetReportCategoriesUsecase,
  GetReportUsecase,
  GetReportsUsecase,
} from './usecases/reports';
import { DeleteReportCategoryUsecase } from './usecases/reports/delete-category.usecase';
import { CreateTandemUsecase } from './usecases/tandems/create-tandem.usecase';
import { GetTandemsUsecase } from './usecases/tandems/get-tandems.usecase';
import { GenerateTandemsUsecase } from './usecases/tandems/generate-tandems.usecase';
import { AddLanguageRequestUsecase } from './usecases/languages/add-request.usecase';
import { CreateCountryUsecase } from './usecases/countries/create-country.usecase';
import { GetCountriesUsecase } from './usecases/countries/get-countries.usecase';

const usecases: Provider[] = [
  // Countries
  CreateCountryUsecase,
  GetCountriesUsecase,
  // Languages
  CreateLanguageUsecase,
  GetLanguagesUsecase,
  GetLanguageUsecase,
  UpdateLanguageUsecase,
  AddLanguageRequestUsecase,
  // Matches
  GetMatchsByProfileIdUsecase,
  // Profiles
  UploadImageUsecase,
  GetProfilesUsecase,
  GetProfileUsecase,
  CreateProfileUsecase,
  UpdateProfileUsecase,
  DeleteProfileUsecase,
  // Reports
  CreateReportUsecase,
  CreateReportCategoryUsecase,
  DeleteReportUsecase,
  DeleteReportCategoryUsecase,
  GetReportsUsecase,
  GetReportUsecase,
  GetReportCategoriesUsecase,
  // Tandems
  CreateTandemUsecase,
  GenerateTandemsUsecase,
  GetTandemsUsecase,
  // Tokens
  GetTokensUsecase,
  RefreshTokensUsecase,
  // Universities
  GetUniversitiesUsecase,
  GetUniversityUsecase,
  CreateUniversityUsecase,
  DeleteUniversityUsecase,
  // Users
  CreateUserUsecase,
  GetUsersUsecase,
  GetUserUsecase,
  ResetPasswordUsecase,
];

const services: Provider[] = [KeycloakAuthenticator, MatchScorer];

@Module({
  imports: [ProvidersModule],
  providers: [...usecases, ...services],
  exports: [...usecases, ...services],
})
export class CoreModule {}
