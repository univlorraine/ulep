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

import { DomainError } from '../errors';
import { LearningLanguagesMustContainsProfiles } from '../errors/match-exceptions';
import { LearningLanguage } from './learning-language.model';
import { LearningType } from './profile.model';
import { Tandem, TandemStatus } from './tandem.model';

export type CreateMatchProps = {
  owner: LearningLanguage;
  target: LearningLanguage;
  scores: MatchScores;
};

export class MatchScores {
  readonly level: number;
  readonly age: number;
  readonly status: number;
  readonly goals: number;
  readonly interests: number;
  readonly meetingFrequency: number;
  readonly certificateOption: number;
  readonly isExclusive: number;

  constructor(props: {
    level: number;
    age: number;
    status: number;
    goals: number;
    interests: number;
    meetingFrequency: number;
    certificateOption: number;
    isExclusive: number;
  }) {
    this.level = props.level;
    this.age = props.age;
    this.status = props.status;
    this.goals = props.goals;
    this.interests = props.interests;
    this.meetingFrequency = props.meetingFrequency;
    this.certificateOption = props.certificateOption;
    this.isExclusive = props.isExclusive;
  }

  static empty(): MatchScores {
    return new MatchScores({
      level: 0,
      age: 0,
      status: 0,
      goals: 0,
      interests: 0,
      meetingFrequency: 0,
      certificateOption: 0,
      isExclusive: 0,
    });
  }

  static exclusivity(): MatchScores {
    return new MatchScores({
      level: 0,
      age: 0,
      status: 0,
      goals: 0,
      interests: 0,
      meetingFrequency: 0,
      certificateOption: 0,
      isExclusive: 1,
    });
  }
}

export class Match {
  readonly owner: LearningLanguage;
  readonly target: LearningLanguage;
  readonly scores: MatchScores;
  readonly total: number;

  constructor(props: CreateMatchProps) {
    if (!props.owner.profile || !props.target.profile) {
      throw new LearningLanguagesMustContainsProfiles();
    }

    if (props.owner.profile.id === props.target.profile.id) {
      throw new DomainError({
        message: 'Owner cannot be the same as target',
      });
    }

    let total = Object.values(props.scores).reduce((a, b) => a + b, 0);
    total = parseFloat(total.toFixed(2));

    if (total < 0 || 1 < total) {
      throw new DomainError({
        message: `The sum of all scores must be between 0 and 1, got ${total}.`,
      });
    }

    if (
      total !== 0 &&
      props.scores.level === 0 &&
      props.scores.isExclusive === 0
    ) {
      throw new DomainError({
        message: 'Langage score must be not null if total is not null',
      });
    }

    this.owner = props.owner;
    this.target = props.target;
    this.scores = props.scores;
    this.total = total;
  }

  public isAValidTandem(): boolean {
    try {
      new Tandem({
        id: '',
        learningLanguages: [this.owner, this.target],
        learningType: LearningType.ETANDEM,
        status: TandemStatus.DRAFT,
        compatibilityScore: this.total,
      });
      return true;
    } catch (err) {
      return false;
    }
  }
}
