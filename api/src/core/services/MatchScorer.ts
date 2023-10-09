import { Language, LearningLanguage, LearningType } from 'src/core/models';
/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { Match, MatchScores, Profile } from '../models';
import { InvalidCoeficientsError, SameProfilesError } from '../errors/match-exceptions';

export type Coeficients = {
  level: number;
  age: number;
  status: number;
  goals: number;
  interests: number;
  meetingFrequency: number;
  certificateOption: number;
};

export interface IMatchScorer {
  computeMatchScore(
    learningLanguage1: LearningLanguage,
    learningLanguage2: LearningLanguage,
    availableLanguages: Language[]
  ): Match;
}

const getMaxValueInNumberMatrix = (matrix: { [key: string]: { [key: string]: number } }) => Object.values(matrix)
  .reduce<number>((accumulator, value) => {
    const maxScoreForValue = Math.max(...Object.values(value)); 
    if (!accumulator || maxScoreForValue > accumulator) {
      return maxScoreForValue
    }

    return accumulator;
  }, -1);


@Injectable()
export class MatchScorer implements IMatchScorer {

  #coeficients: Coeficients = {
    level: 0.70,
    age: 0.05,
    status: 0.05,
    goals: 0.05,
    interests: 0.05,
    meetingFrequency: 0.05,
    certificateOption: 0.05,
  };


  // Note: A learning language can only match a language spoken by the potential match profile. As all
  // languages spoken are approximated with the same skill level ,we approximate the compatibility 
  // score only with learning language levels. We consider in this method that compatibility
  // has already been asserted (i.e. learningLanguage 1 is spoken by profile 2 and learningLanguage 2 is spoken by profile 1).
  // Note: to preserve this approximation, it is mandatory that matrix are symetrics
  #standardPairingLearningLanguagesCompatibilityMatrix: { [key: string]: { [key: string]: number } } = {
    A0: { A0: 0, A1: 1, A2: 1, B1: 2, B2: 2, C1: 2, C2: 2 },
    A1: { A0: 1, A1: 2, A2: 2, B1: 3, B2: 3, C1: 3, C2: 3 },
    A2: { A0: 1, A1: 2, A2: 2, B1: 4, B2: 4, C1: 4, C2: 4 },
    B1: { A0: 2, A1: 3, A2: 4, B1: 5, B2: 5, C1: 5, C2: 5 },
    B2: { A0: 2, A1: 3, A2: 4, B1: 5, B2: 5, C1: 5, C2: 5 },
    C1: { A0: 2, A1: 3, A2: 4, B1: 5, B2: 5, C1: 5, C2: 5 },
    C2: { A0: 2, A1: 3, A2: 4, B1: 5, B2: 5, C1: 5, C2: 5 },
  }
  #standardPairingLearningLanguagesCompatibilityMatrixMaxScore: number;

  #discoveryPairingLearningLanguagesCompatibilityMatrix: { [key: string]: { [key: string]: number } } = {
    A0: { A0: 0, A1: 1, A2: 2, B1: 3, B2: 3, C1: 3, C2: 3 },
    A1: { A0: 1, A1: 1, A2: 2, B1: 5, B2: 5, C1: 5, C2: 5 },
    A2: { A0: 2, A1: 2, A2: 3, B1: 4, B2: 4, C1: 4, C2: 4 },
    B1: { A0: 3, A1: 5, A2: 4, B1: 2, B2: 2, C1: 2, C2: 2 },
    B2: { A0: 3, A1: 5, A2: 4, B1: 2, B2: 2, C1: 2, C2: 2 },
    C1: { A0: 3, A1: 5, A2: 4, B1: 2, B2: 2, C1: 2, C2: 2 },
    C2: { A0: 3, A1: 5, A2: 4, B1: 2, B2: 2, C1: 2, C2: 2 },
  };
  #discoveryPairingLearningLanguagesCompatibilityMatrixMaxScore: number;


  constructor() {
    this.#standardPairingLearningLanguagesCompatibilityMatrixMaxScore = getMaxValueInNumberMatrix(this.#standardPairingLearningLanguagesCompatibilityMatrix);
    this.#discoveryPairingLearningLanguagesCompatibilityMatrixMaxScore = getMaxValueInNumberMatrix(this.#discoveryPairingLearningLanguagesCompatibilityMatrix);
  }

  public set coeficients(coeficients: Coeficients) {
    const sum = Object.values(coeficients).reduce((a, b) => a + b, 0);
    if (sum !== 1) {
      throw new InvalidCoeficientsError();
    }
    this.#coeficients = coeficients;
  }

  public get coeficients(): Coeficients {
    return this.#coeficients;
  }

  // TODO(bonus): Use interest categories similarity instead of interests
  public computeMatchScore(
    learningLanguage1: LearningLanguage,
    learningLanguage2: LearningLanguage,
    availableLanguages: Language[]
  ): Match {
    const profile1 = learningLanguage1.profile;
    const profile2 = learningLanguage2.profile;

    if (profile1.id === profile2.id) {
      throw new SameProfilesError();
    }

    if (!this.assertMatchIsNotForbidden(
      learningLanguage1,
      learningLanguage2,
      availableLanguages,
    )) {
      return new Match({ owner: learningLanguage1, target: learningLanguage2, scores: MatchScores.empty() });
    }

    const scores: MatchScores = new MatchScores({
      level: this.computeLearningCompatibility(learningLanguage1, learningLanguage2),
      age: this.computeAgeBonus(profile1, profile2),
      status: this.computeSameRolesBonus(profile1, profile2),
      goals: this.computeSameGoalsBonus(profile1, profile2),
      interests: this.computeSameInterestBonus(profile1, profile2),
      meetingFrequency: this.computeMeetingFrequencyBonus(profile1, profile2),
      certificateOption: this.computeCertificateOptionBonus(learningLanguage1, learningLanguage2)
    });

    return new Match({
      owner: learningLanguage1,
      target: learningLanguage2,
      scores,
    });
  }

  /**
   * Compute learning compatibility score between 2 learning languages.
   * @param learningLanguage1 
   * @param learningLanguage2 
   * @returns 
   */
  private computeLearningCompatibility(learningLanguage1: LearningLanguage, learningLanguage2: LearningLanguage): number {
    const isDiscovery = learningLanguage1.isDiscovery(learningLanguage2) || learningLanguage2.isDiscovery(learningLanguage1);
  
    const score = isDiscovery
      ? this.#discoveryPairingLearningLanguagesCompatibilityMatrix[learningLanguage1.level][learningLanguage2.level] / this.#discoveryPairingLearningLanguagesCompatibilityMatrixMaxScore
      : this.#standardPairingLearningLanguagesCompatibilityMatrix[learningLanguage1.level][learningLanguage2.level] / this.#standardPairingLearningLanguagesCompatibilityMatrixMaxScore;

    return this.coeficients.level * score;
  }

  // Apply bunus if ages match criteria
  private computeAgeBonus(profile1: Profile, profile2: Profile): number {
    // Compute the absolute age difference between the two profiles
    const ageDiff: number = Math.abs(profile1.user.age - profile2.user.age);

    // If age of one of profile is greater than 50
    if (profile1.user.age > 50 || profile2.user.age > 50) {
      // Apply the age bonus if the age of the second profile is greater than 45 or vice versa
      // If the other profile is 45 or younger, return the original score
      if (
        (profile1.user.age > 50 && profile2.user.age > 45)
        || (profile2.user.age > 50 && profile1.user.age > 45)
      ) {
        return this.coeficients.age;  
      } else {
        return 0;
      }
    }

    // If the age of the first profile is greater than 30 (but not greater than 50,
    // because of the previous condition)
    if (profile1.user.age > 30 || profile2.user.age > 30) {
      // Apply the age bonus if the age difference between the profiles is inferior or equal to 10
      // If the age difference is outside this range, return the original score
      return ageDiff <= 10 ? this.coeficients.age : 0;
    }

    // If the age of the first profile is 30 or younger
    // Apply the age bonus if the age difference between the profiles is inferior or equal to 3
    // If the age difference is outside this range, return the original score
    return ageDiff <= 3 ? this.coeficients.age : 0;
  }

  // Apply bonus if profiles share the same status
  private computeSameRolesBonus(profile1: Profile, profile2: Profile): number {
    // If the status of the two profiles is the same apply a bonus to the score.
    if (profile1.user.role === profile2.user.role) {
      return this.coeficients.status;
    }

    return 0;
  }

  // Apply bonus if profiles share the same goals
  private computeSameGoalsBonus(profile1: Profile, profile2: Profile): number {
    const similarity = this.computeSimilarity(
      new Set(profile1.objectives.map((goal) => goal.id)),
      new Set(profile2.objectives.map((goal) => goal.id)),
    );

    return this.coeficients.goals * similarity;
  }

  // Apply bonus if profiles share the same interests
  private computeSameInterestBonus(
    profile1: Profile,
    profile2: Profile,
  ): number {
    const similarity = this.computeSimilarity(
      new Set(profile1.interests.map((interest) => interest.id)),
      new Set(profile2.interests.map((interest) => interest.id)),
    );

    return this.coeficients.interests * similarity;
  }


  // Compute the similarity between two sets of strings using the Jaccard index
  private computeSimilarity(set1: Set<string>, set2: Set<string>): number {
    const intersection = new Set([...set1].filter(x => set2.has(x)));
    const union = new Set([...set1, ...set2]);

    if (union.size === 0) {
      return 0;
    }

    return intersection.size / union.size;
  }

  private computeMeetingFrequencyBonus(
    profile1: Profile,
    profile2: Profile
  ): number {
    if (profile1.meetingFrequency === profile2.meetingFrequency) {
      return this.#coeficients.meetingFrequency;
    }

    return 0;
  }

  private computeCertificateOptionBonus(
    learningLanguage1: LearningLanguage,
    learningLanguage2: LearningLanguage
  ): number {
    if (!!learningLanguage1.certificateOption === !!learningLanguage2.certificateOption) {
      return this.#coeficients.certificateOption;
    }
    
    return 0;
  }

  private assertMatchIsNotForbidden(
    learningLanguage1: LearningLanguage,
    learningLanguage2: LearningLanguage,
    availableLanguages: Language[]
  ): boolean {
    const profile1 = learningLanguage1.profile;
    const profile2 = learningLanguage2.profile;
    
    // Check joker language have a match in available languages spoken by other profile
    if (learningLanguage1.language.isJokerLanguage()) {
      if (!profile1.canLearnALanguageFromProfile(profile2, availableLanguages)) {
        return false;
      }
    }
    if (learningLanguage2.language.isJokerLanguage()) {
      if (!profile2.canLearnALanguageFromProfile(profile1, availableLanguages)) {
        return false;
      }
    }

    if (!learningLanguage1.isCompatibleWithLearningLanguage(learningLanguage2) ||
      !learningLanguage2.isCompatibleWithLearningLanguage(learningLanguage1)
    ) {
      return false;
    }

    // Check forbidden case of same gender
    if ((learningLanguage1.sameGender || learningLanguage2.sameGender)
      && profile1.user.gender !== profile2.user.gender
    ) {
        return false;
    }

    // Check incompatibilities between learning types
    if (learningLanguage1.learningType !== learningLanguage2.learningType && (
      learningLanguage1.learningType !== LearningType.BOTH && learningLanguage2.learningType !== LearningType.BOTH
    )) {
        return false;
    }

    // Check same campus if tandem
    if (
      (learningLanguage1.learningType === LearningType.TANDEM
        || learningLanguage2.learningType === LearningType.TANDEM)
      && (
        (!learningLanguage1.campus || !learningLanguage2.campus)
        || (learningLanguage1.campus.id !== learningLanguage2.campus.id)
      )
     ) {
        return false;
    }

    return true;
  }
}
