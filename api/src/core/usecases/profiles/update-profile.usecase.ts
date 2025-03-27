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
import { DomainErrorCode, RessourceDoesNotExist } from 'src/core/errors';
import {
  Availabilites,
  Interest,
  Language,
  LearningObjective,
  MeetingFrequency,
  Profile,
} from 'src/core/models';
import {
  PROFILE_REPOSITORY,
  ProfileRepository,
} from 'src/core/ports/profile.repository';
import {
  INTEREST_REPOSITORY,
  InterestRepository,
} from 'src/core/ports/interest.repository';
import {
  LANGUAGE_REPOSITORY,
  LanguageRepository,
} from 'src/core/ports/language.repository';
import {
  LearningObjectiveRepository,
  OBJECTIVE_REPOSITORY,
} from 'src/core/ports/objective.repository';

export class UpdateProfileCommand {
  availabilities?: Availabilites;
  availabilitiesNote?: string;
  availabilitiesNotePrivacy?: boolean;
  biography?: { [key: string]: string };
  interests: string[];
  masteredLanguageCodes?: string[];
  meetingFrequency: MeetingFrequency;
  nativeLanguageCode: string;
  objectives: string[];
}

@Injectable()
export class UpdateProfileUsecase {
  constructor(
    @Inject(INTEREST_REPOSITORY)
    private readonly interestsRepository: InterestRepository,
    @Inject(LANGUAGE_REPOSITORY)
    private readonly languageRepository: LanguageRepository,
    @Inject(OBJECTIVE_REPOSITORY)
    private readonly objectiveRepository: LearningObjectiveRepository,
    @Inject(PROFILE_REPOSITORY)
    private readonly profileRepository: ProfileRepository,
  ) {}

  async execute(id: string, command: UpdateProfileCommand): Promise<Profile> {
    const profile = await this.profileRepository.ofId(id);

    if (!profile) {
      throw new RessourceDoesNotExist();
    }

    const interests = await Promise.all(
      command.interests.map((id) => this.tryToFindTheInterestOfId(id)),
    );

    const nativeLanguage = await this.tryToFindTheLanguageOfCode(
      command.nativeLanguageCode,
    );

    const masteredLanguages = await Promise.all(
      (command.masteredLanguageCodes ?? []).map((code) =>
        this.tryToFindTheLanguageOfCode(code),
      ),
    );

    const objectives = await Promise.all(
      command.objectives.map((id) => this.tryToFindTheObjectiveOfId(id)),
    );

    const newProfile = new Profile({
      ...profile,
      ...(command.availabilities && { availabilities: command.availabilities }),
      ...(command.availabilitiesNote && {
        availabilitiesNote: command.availabilitiesNote,
      }),
      ...(command.availabilitiesNotePrivacy && {
        availabilitiesNotePrivacy: command.availabilitiesNotePrivacy,
      }),
      ...(command.biography && { biography: command.biography }),
      ...(command.meetingFrequency && {
        meetingFrequency: command.meetingFrequency,
      }),
      ...(nativeLanguage && { nativeLanguage }),
      ...(masteredLanguages && { masteredLanguages }),
      ...(interests && { interests }),
      ...(objectives && { objectives }),
    });

    const updatedProfile = await this.profileRepository.update(newProfile);

    return updatedProfile;
  }

  private async tryToFindTheInterestOfId(id: string): Promise<Interest> {
    const interest = await this.interestsRepository.interestOfId(id);
    if (!interest) {
      throw new RessourceDoesNotExist('Interest does not exist');
    }

    return interest;
  }

  private async tryToFindTheLanguageOfCode(code: string): Promise<Language> {
    const language = await this.languageRepository.ofCode(code.toLowerCase());
    if (!language) {
      throw new RessourceDoesNotExist('Language does not exist');
    }

    return language;
  }

  private async tryToFindTheObjectiveOfId(
    id: string,
  ): Promise<LearningObjective> {
    const objective = await this.objectiveRepository.ofId(id);
    if (!objective) {
      throw new RessourceDoesNotExist(
        'The objective does not exist',
        DomainErrorCode.BAD_REQUEST,
      );
    }

    return objective;
  }
}
