import { Module, Provider } from '@nestjs/common';
import { CreateUserUsecase } from './usecases/users/create-user.usecase';
import { ProvidersModule } from '../providers/providers.module';
import { UploadImageUsecase } from './usecases/uploads/upload-image.usecase';
import { ResetPasswordUsecase } from './usecases/users/reset-password.usecase';
import { CreateUniversityUsecase } from './usecases/universities/create-university.usecase';
import { UpdateUniversityUsecase } from './usecases/universities/update-university.usecase';
import { GetUniversitiesUsecase } from './usecases/universities/get-universities.usecase';
import { DeleteUniversityUsecase } from './usecases/universities/delete-university.usecase';
import { GetUniversityUsecase } from './usecases/universities/get-university.usecase';
import { GetUsersUsecase } from './usecases/users/get-users.usecase';
import { GetCountriesUsecase } from './usecases/countries/get-countries.usecase';
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
import { MatchService } from './services/matchs/MatchService';
import { KeycloakAuthenticator } from './services/authentication/authenticator';
import { GetMatchsByProfileIdUsecase } from './usecases/matchs/GetMatchsByProfileId';
import { GetLanguageUsecase } from './usecases/languages/get-language.usecase';
import { GetCountryUsecase } from './usecases/countries/get-country.usecase';

const usecases: Provider[] = [
  // Countries
  GetCountriesUsecase,
  GetCountryUsecase,
  // Languages
  CreateLanguageUsecase,
  GetLanguagesUsecase,
  GetLanguageUsecase,
  UpdateLanguageUsecase,
  // Matches
  GetMatchsByProfileIdUsecase,
  // Profiles
  UploadImageUsecase,
  GetProfilesUsecase,
  GetProfileUsecase,
  CreateProfileUsecase,
  UpdateProfileUsecase,
  DeleteProfileUsecase,
  // Universities
  GetUniversitiesUsecase,
  GetUniversityUsecase,
  CreateUniversityUsecase,
  UpdateUniversityUsecase,
  DeleteUniversityUsecase,
  // Tokens
  GetTokensUsecase,
  RefreshTokensUsecase,
  // Users
  CreateUserUsecase,
  GetUsersUsecase,
  GetUserUsecase,
  ResetPasswordUsecase,
];

const services: Provider[] = [KeycloakAuthenticator, MatchService];

@Module({
  imports: [ProvidersModule],
  providers: [...usecases, ...services],
  exports: [...usecases, ...services],
})
export class CoreModule {}
