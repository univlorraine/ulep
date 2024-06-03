import { Inject, Injectable, Logger } from '@nestjs/common';
import {
  UNIVERSITY_REPOSITORY,
  UniversityRepository,
} from '../../ports/university.repository';
import { RessourceDoesNotExist } from 'src/core/errors';
import { PairingMode, University } from 'src/core/models';
import {
  COUNTRY_REPOSITORY,
  CountryRepository,
} from 'src/core/ports/country.repository';
import {
  LANGUAGE_REPOSITORY,
  LanguageRepository,
} from 'src/core/ports/language.repository';

export class UpdateUniversityCommand {
  id: string;
  name: string;
  countryId: string;
  timezone: string;
  admissionEnd: Date;
  admissionStart: Date;
  openServiceDate: Date;
  closeServiceDate: Date;
  codes: string[];
  domains: string[];
  website: string;
  pairingMode: PairingMode;
  maxTandemsPerUser: number;
  notificationEmail?: string;
  specificLanguagesAvailableIds: string[];
  nativeLanguageId: string;
  defaultContactId?: string;
}

@Injectable()
export class UpdateUniversityUsecase {
  private readonly logger = new Logger(UpdateUniversityUsecase.name);

  constructor(
    @Inject(COUNTRY_REPOSITORY)
    private readonly countryRepository: CountryRepository,
    @Inject(LANGUAGE_REPOSITORY)
    private readonly languageRepository: LanguageRepository,
    @Inject(UNIVERSITY_REPOSITORY)
    private readonly universityRepository: UniversityRepository,
  ) {}

  async execute(command: UpdateUniversityCommand) {
    this.logger.log(JSON.stringify(command));
    const university = await this.universityRepository.ofId(command.id);
    if (!university) {
      throw new RessourceDoesNotExist();
    }

    let specificLanguagesAvailable = [];
    if (command.specificLanguagesAvailableIds) {
      specificLanguagesAvailable = await Promise.all(
        command.specificLanguagesAvailableIds.map((id) =>
          this.languageRepository.ofId(id),
        ),
      );

      if (specificLanguagesAvailable.some((language) => !language)) {
        throw new RessourceDoesNotExist(
          'One or more specified language IDs do not exist.',
        );
      }
    }

    const nativeLanguage = await this.languageRepository.ofId(
      command.nativeLanguageId,
    );
    if (!nativeLanguage) {
      throw new RessourceDoesNotExist('Native language does not exist');
    }

    const country = await this.countryRepository.ofId(command.countryId);
    if (!country) {
      throw new RessourceDoesNotExist('Country does not exist');
    }

    const universityToUpdate = new University({
      id: university.id,
      name: command.name,
      country,
      codes: command.codes || [],
      domains: command.domains || [],
      timezone: command.timezone,
      admissionEnd: command.admissionEnd,
      admissionStart: command.admissionStart,
      openServiceDate: command.openServiceDate,
      closeServiceDate: command.closeServiceDate,
      campus: university.campus,
      website: command.website,
      pairingMode: command.pairingMode,
      maxTandemsPerUser: command.maxTandemsPerUser,
      notificationEmail: command.notificationEmail,
      specificLanguagesAvailable,
      nativeLanguage,
      defaultContactId: command.defaultContactId || university.defaultContactId,
    });

    const updatedUniversity = await this.universityRepository.update(
      universityToUpdate,
    );

    return new University(updatedUniversity);
  }
}
