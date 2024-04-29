import { KeycloakClient } from '@app/keycloak';
import { Inject, Injectable } from '@nestjs/common';
import { DomainError, RessourceDoesNotExist } from 'src/core/errors';
import {
  Language,
  PairingMode,
  University,
  UniversityWithKeycloakContact,
} from 'src/core/models';
import { Campus } from 'src/core/models/campus.model';
import {
  COUNTRY_REPOSITORY,
  CountryRepository,
} from 'src/core/ports/country.repository';
import {
  LANGUAGE_REPOSITORY,
  LanguageRepository,
} from 'src/core/ports/language.repository';
import {
  UNIVERSITY_REPOSITORY,
  UniversityRepository,
} from 'src/core/ports/university.repository';
import {
  UUID_PROVIDER,
  UuidProviderInterface,
} from 'src/core/ports/uuid.provider';

export class CreateUniversityCommand {
  countryId: string;
  name: string;
  campusNames: string[];
  timezone: string;
  admissionStart: Date;
  admissionEnd: Date;
  openServiceDate: Date;
  closeServiceDate: Date;
  website?: string;
  codes?: string[];
  domains?: string[];
  pairingMode: PairingMode;
  maxTandemsPerUser: number;
  notificationEmail?: string;
  specificLanguagesAvailableIds: string[];
  nativeLanguageId: string;
  defaultContactId: string;
}

@Injectable()
export class CreateUniversityUsecase {
  constructor(
    @Inject(COUNTRY_REPOSITORY)
    private readonly countryRepository: CountryRepository,
    @Inject(LANGUAGE_REPOSITORY)
    private readonly languageRepository: LanguageRepository,
    @Inject(UNIVERSITY_REPOSITORY)
    private readonly universityRepository: UniversityRepository,
    @Inject(UUID_PROVIDER)
    private readonly uuidProvider: UuidProviderInterface,
    private readonly keycloakClient: KeycloakClient,
  ) {}

  async execute(command: CreateUniversityCommand) {
    const universities = await this.universityRepository.findAll();
    if (universities.items.length > 0) {
      throw new DomainError({ message: 'Central university already exists' });
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

    let specificLanguagesAvailable: Language[] = [];
    if (command.specificLanguagesAvailableIds?.length > 0) {
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

    const defaultKeycloakContact = command.defaultContactId
      ? await this.keycloakClient.getUserById(command.defaultContactId)
      : null;

    if (!defaultKeycloakContact) {
      throw new RessourceDoesNotExist("Administrator contact doesn't exists.");
    }

    const instance = await this.universityRepository.ofName(command.name);
    if (instance) {
      throw new DomainError({ message: 'University name must be unique' });
    }

    const universityId = this.uuidProvider.generate();

    const university = University.create({
      id: universityId,
      name: command.name,
      parent: null,
      campus: command.campusNames.map(
        (campusName) =>
          new Campus({
            id: this.uuidProvider.generate(),
            name: campusName,
            universityId: universityId,
          }),
      ),
      country,
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
      specificLanguagesAvailable,
      nativeLanguage,
      defaultContactId: defaultKeycloakContact.id,
    });

    const newUniversity = await this.universityRepository.create(university);

    return new UniversityWithKeycloakContact({
      ...newUniversity,
      defaultContact: defaultKeycloakContact,
    });
  }
}
