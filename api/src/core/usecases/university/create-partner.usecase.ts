import { Inject, Injectable } from '@nestjs/common';
import { DomainError, RessourceDoesNotExist } from 'src/core/errors';
import { PairingMode, University } from 'src/core/models';
import {
  CountryRepository,
  COUNTRY_REPOSITORY,
} from 'src/core/ports/country.repository';
import {
  EditoRepository,
  EDITO_REPOSITORY,
} from 'src/core/ports/edito.repository';
import {
  LanguageRepository,
  LANGUAGE_REPOSITORY,
} from 'src/core/ports/language.repository';
import {
  UniversityRepository,
  UNIVERSITY_REPOSITORY,
} from 'src/core/ports/university.repository';
import {
  UuidProviderInterface,
  UUID_PROVIDER,
} from 'src/core/ports/uuid.provider';

export class CreatePartnerUniversityCommand {
  admissionStart: Date;
  admissionEnd: Date;
  openServiceDate: Date;
  closeServiceDate: Date;
  countryId: string;
  name: string;
  timezone: string;
  website?: string;
  codes?: string[];
  domains?: string[];
  pairingMode: PairingMode;
  maxTandemsPerUser: number;
  notificationEmail?: string;
  specificLanguagesAvailableIds: string[];
  nativeLanguageId: string;
}

@Injectable()
export class CreatePartnerUniversityUsecase {
  constructor(
    @Inject(COUNTRY_REPOSITORY)
    private readonly countryRepository: CountryRepository,
    @Inject(LANGUAGE_REPOSITORY)
    private readonly languageRepository: LanguageRepository,
    @Inject(UNIVERSITY_REPOSITORY)
    private readonly universityRepository: UniversityRepository,
    @Inject(EDITO_REPOSITORY)
    private readonly editoRepository: EditoRepository,
    @Inject(UUID_PROVIDER)
    private readonly uuidProvider: UuidProviderInterface,
  ) {}

  async execute(command: CreatePartnerUniversityCommand) {
    const central = await this.universityRepository.findUniversityCentral();
    if (!central) {
      throw new DomainError({ message: 'Central university does not exists' });
    }

    const country = await this.countryRepository.ofId(command.countryId);

    if (!country) {
      throw new RessourceDoesNotExist('Country does not exist');
    }

    const nativeLanguage = await this.languageRepository.ofId(
      command.nativeLanguageId,
    );

    if (!nativeLanguage) {
      throw new RessourceDoesNotExist('Native language does not exist.');
    }

    let specificLanguages = [];
    if (
      command.specificLanguagesAvailableIds &&
      command.specificLanguagesAvailableIds.length > 0
    ) {
      specificLanguages = await Promise.all(
        command.specificLanguagesAvailableIds.map((id) =>
          this.languageRepository.ofId(id),
        ),
      );

      if (specificLanguages.some((language) => !language)) {
        throw new RessourceDoesNotExist(
          'One or more specified language IDs do not exist.',
        );
      }
    }

    const oldUniversity = await this.universityRepository.ofName(command.name);
    if (oldUniversity) {
      throw new DomainError({ message: 'University name must be unique' });
    }

    const university = University.create({
      id: this.uuidProvider.generate(),
      name: command.name,
      parent: central.id,
      country,
      campus: [],
      timezone: command.timezone,
      admissionStart: command.admissionStart,
      admissionEnd: command.admissionEnd,
      openServiceDate: command.openServiceDate,
      closeServiceDate: command.closeServiceDate,
      website: command.website,
      codes: command.codes,
      domains: command.domains,
      pairingMode: command.pairingMode,
      maxTandemsPerUser: command.maxTandemsPerUser,
      notificationEmail: command.notificationEmail,
      specificLanguagesAvailable: specificLanguages,
      nativeLanguage,
    });

    const newUniversity = await this.universityRepository.create(university);

    const centralUniversity =
      await this.universityRepository.findUniversityCentral();

    const translationsLanguageCodes = [];
    if (
      newUniversity.nativeLanguage.code !==
      centralUniversity.nativeLanguage.code
    ) {
      translationsLanguageCodes.push(newUniversity.nativeLanguage.code);
    }
    if (
      newUniversity.nativeLanguage.code !== 'en' &&
      centralUniversity.nativeLanguage.code !== 'en'
    ) {
      translationsLanguageCodes.push('en');
    }

    await this.editoRepository.create({
      universityId: newUniversity.id,
      defaultLanguageCode: centralUniversity.nativeLanguage.code,
      translationsLanguageCodes: translationsLanguageCodes,
    });

    return newUniversity;
  }
}
