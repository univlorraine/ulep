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

/* eslint-disable prettier/prettier */
import {
  InvalidTandemError,
  LearningLanguagesMustContainsProfilesForTandem,
} from '../errors/tandem-exceptions';
import { LearningLanguage } from './learning-language.model';
import { LearningType } from './profile.model';

export enum TandemStatus {
  INACTIVE = 'INACTIVE',
  DRAFT = 'DRAFT',
  VALIDATED_BY_ONE_UNIVERSITY = 'VALIDATED_BY_ONE_UNIVERSITY',
  PAUSED = 'PAUSED',
  ACTIVE = 'ACTIVE',
}

export enum WithoutTandem {
  NO_TANDEM = 'NO_TANDEM',
}

export type TandemStatusFilter = TandemStatus | WithoutTandem;

export type CreateTandemProps = {
  id: string;
  learningLanguages?: LearningLanguage[];
  learningType: LearningType;
  status: TandemStatus;
  universityValidations?: string[];
  compatibilityScore: number;
  createdAt?: Date;
  updatedAt?: Date;
};

export class Tandem {
  readonly id: string;

  // Learning languages that compose the tandem
  readonly learningLanguages?: LearningLanguage[];

  // Status of the tandem
  readonly status: TandemStatus;

  // Type of learning of the tandem
  readonly learningType: LearningType;

  // ID of universities which has validated the tandem
  readonly universityValidations?: string[];

  // Score representing compatibility of learning languages
  readonly compatibilityScore: number;

  readonly createdAt?: Date;

  readonly updatedAt?: Date;

  isValid: boolean;

  constructor(props: CreateTandemProps) {
    this.id = props.id;
    this.status = props.status;
    this.learningType = props.learningType;
    this.universityValidations = props.universityValidations || [];
    this.compatibilityScore = props.compatibilityScore;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
    this.isValid = true;

    if (props.learningLanguages) {
      this.learningLanguages = [...props.learningLanguages];
      this.assertNoErrors();
    }
  }

  static create(props: CreateTandemProps): Tandem {
    return new Tandem(props);
  }

  private assertNoErrors() {
    // For now, in production, students are allowed to change their mastered languages
    // after the tandem has been created, so it becomes invalid. But we have to keep
    // the script running for purge to work (and filter out those tandems for archives).

    if (this.learningLanguages.length !== 2) {
      throw new InvalidTandemError(
        'Tandem must have exactly two learning languages',
      );
    }

    if (this.learningLanguages[0].id === this.learningLanguages[1].id) {
      this.isValid = false;
      console.error(
        'Tandem must have two different learning languages',
        this.learningLanguages,
      );
      /*       throw new InvalidTandemError(
        'Tandem must have two different learning languages',
      ); */
    }

    const profile1 = this.learningLanguages[0].profile;
    const profile2 = this.learningLanguages[1].profile;

    if (!profile1 || !profile2) {
      return new LearningLanguagesMustContainsProfilesForTandem();
    }

    if (profile1.id === profile2.id) {
      throw new InvalidTandemError('Tandem must have two different profiles');
    }

    if (
      !profile1.user.university.isCentralUniversity() &&
      !profile2.user.university.isCentralUniversity()
    ) {
      throw new InvalidTandemError(
        'Tandem must concern at least one user from central university',
      );
    }

    if (
      !this.learningLanguages[0].isCompatibleWithLearningLanguage(
        this.learningLanguages[1],
      )
    ) {
      this.isValid = false;
      console.error(
        `learningLanguage ${this.learningLanguages[0].id} doesn't match learningLanguages ${this.learningLanguages[1].id} languages`,
      );
      /*       throw new InvalidTandemError(
        `learningLanguage ${this.learningLanguages[0].id} doesn't match learningLanguages ${this.learningLanguages[1].id} languages`,
      ); */
    }
    if (
      !this.learningLanguages[1].isCompatibleWithLearningLanguage(
        this.learningLanguages[0],
      )
    ) {
      this.isValid = false;
      console.error(
        `learningLanguage ${this.learningLanguages[1].id} doesn't match learningLanguages ${this.learningLanguages[0].id} languages`,
      );
      /*       throw new InvalidTandemError(
      throw new InvalidTandemError(
        `learningLanguage ${this.learningLanguages[1].id} doesn't match learningLanguages ${this.learningLanguages[0].id} languages`,
      ); */
    }
  }

  getHash(): string {
    return this.learningLanguages?.length > 0
      ? this.learningLanguages
          .map((ll) => ll.id)
          .sort((a, b) => a.localeCompare(b))
          .join('_')
      : '';
  }
}
