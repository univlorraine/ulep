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
