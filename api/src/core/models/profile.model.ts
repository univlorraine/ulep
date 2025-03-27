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

import { TestedLanguage } from 'src/core/models/tested-language.model';
import { ProfileLanguagesException } from '../errors/profile-exceptions';
import { Interest } from './interest.model';
import { Language } from './language.model';
import { LearningLanguage } from './learning-language.model';
import { LearningObjective } from './objective.model';
import { ProficiencyLevel } from './proficiency.model';
import { User } from './user.model';

export enum LearningType {
  ETANDEM = 'ETANDEM',
  TANDEM = 'TANDEM',
  BOTH = 'BOTH',
}

export enum MeetingFrequency {
  ONCE_A_WEEK = 'ONCE_A_WEEK',
  TWICE_A_WEEK = 'TWICE_A_WEEK',
  THREE_TIMES_A_WEEK = 'THREE_TIMES_A_WEEK',
  TWICE_A_MONTH = 'TWICE_A_MONTH',
  THREE_TIMES_A_MONTH = 'THREE_TIMES_A_MONTH',
}

export enum AvailabilitesOptions {
  UNAVAILABLE = 'UNAVAILABLE',
  AVAILABLE = 'AVAILABLE',
  VERY_AVAILABLE = 'VERY_AVAILABLE',
}

export interface Availabilites {
  monday: AvailabilitesOptions;
  tuesday: AvailabilitesOptions;
  wednesday: AvailabilitesOptions;
  thursday: AvailabilitesOptions;
  friday: AvailabilitesOptions;
  saturday: AvailabilitesOptions;
  sunday: AvailabilitesOptions;
}

export type CreateProfileProps = {
  id: string;
  user: User;
  nativeLanguage: Language;
  masteredLanguages: Language[];
  testedLanguages: TestedLanguage[];
  learningLanguages: LearningLanguage[];
  meetingFrequency: MeetingFrequency;
  objectives: LearningObjective[];
  interests: Interest[];
  availabilities?: Availabilites;
  availabilitiesNote?: string;
  availabilitiesNotePrivacy?: boolean;
  biography?: { [key: string]: string };
  createdAt?: Date;
  updatedAt?: Date;
};

export class Profile {
  readonly id: string;
  readonly user: User;
  readonly nativeLanguage: Language;
  readonly masteredLanguages: Language[];
  readonly learningLanguages: LearningLanguage[];
  readonly meetingFrequency: MeetingFrequency;
  readonly testedLanguages: TestedLanguage[];
  readonly objectives: LearningObjective[];
  readonly interests: Interest[];
  readonly availabilities?: Availabilites;
  readonly availabilitiesNote?: string;
  readonly availabilitiesNotePrivacy?: boolean;
  readonly biography?: { [key: string]: string };
  readonly createdAt?: Date;
  readonly updatedAt?: Date;

  constructor(props: CreateProfileProps) {
    const learningLanguages = [...props.learningLanguages].map(
      (learningLanguage) =>
        new LearningLanguage({
          ...learningLanguage,
          level: learningLanguage.language.isJokerLanguage()
            ? ProficiencyLevel.A0
            : learningLanguage.level,
        }),
    );

    this.id = props.id;
    this.user = props.user;
    this.nativeLanguage = props.nativeLanguage;
    this.masteredLanguages = [...props.masteredLanguages];
    this.testedLanguages = props.testedLanguages;
    this.learningLanguages = learningLanguages;
    this.meetingFrequency = props.meetingFrequency;
    this.availabilities = props.availabilities;
    this.availabilitiesNote = props.availabilitiesNote;
    this.availabilitiesNotePrivacy = props.availabilitiesNotePrivacy;
    this.objectives = [...props.objectives];
    this.interests = [...props.interests];
    this.biography = props.biography;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;

    this.assertLanguagesAreUnique();
  }

  protected assertLanguagesAreUnique(): void {
    const masteredLanguagesCodes = this.masteredLanguages.map((l) => l.code);

    if (masteredLanguagesCodes.includes(this.nativeLanguage.code)) {
      throw new ProfileLanguagesException(
        'Native language cannot be a mastered language',
      );
    }
  }

  get spokenLanguages(): Language[] {
    return [this.nativeLanguage, ...this.masteredLanguages];
  }

  public isSpeakingLanguage(language: Language): boolean {
    return this.spokenLanguages.some(
      (spokenLanguage) => spokenLanguage.id === language.id,
    );
  }

  public isLearningLanguage(language: Language): boolean {
    return this.learningLanguages.some(
      (learningLanguage) => learningLanguage.language.id === language.id,
    );
  }

  /**
   * Check if this profile can learn a language from another profile
   * @param profile Profile from which we want to learn
   * @param availableLanguages Available languages to be learnt in system
   * @returns {boolean}
   */
  public canLearnALanguageFromProfile(
    profile: Profile,
    availableLanguages: Language[],
  ): boolean {
    const potentialLanguagesToLearnFromProfile = this.user
      .filterLearnableLanguages(availableLanguages)
      .filter(
        (language) =>
          !language.isJokerLanguage() &&
          profile.isSpeakingLanguage(language) &&
          !this.isSpeakingLanguage(language),
      );
    if (potentialLanguagesToLearnFromProfile.length === 0) {
      return false;
    }

    return true;
  }

  public findLearningLanguageByCode(
    code: string,
  ): LearningLanguage | undefined {
    return this.learningLanguages.find(
      (learningLanguage) => learningLanguage.language.code === code,
    );
  }
}
