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
  gender: number;
  university: number;
};

export interface IMatchScorer {
  computeMatchScore(profile1: Profile, profile2: Profile): Match;
}

@Injectable()
export class MatchScorer implements IMatchScorer {

  #coeficients: Coeficients = {
    level: 0.7,
    age: 0.05,
    status: 0.05,
    goals: 0.05,
    interests: 0.05,
    gender: 0.05,
    university: 0.05,
  };

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

  public computeMatchScore(profile1: Profile, profile2: Profile): Match {
    if (profile1.id === profile2.id) {
      throw new SameProfilesError();
    }

    const isDiscovery = !profile1.languages.learning || !profile2.languages.learning;

    const scores: MatchScores = {
      level: this.computeLanguageLevel(profile1, profile2, isDiscovery),
      age: this.computeAgeBonus(profile1, profile2),
      status: this.computeSameRolesBonus(profile1, profile2),
      goals: this.computeSameGoalsBonus(profile1, profile2),
      university: this.computeSameUniversityBonus(profile1, profile2),
      gender: this.computeSameGenderBonus(profile1, profile2),
      interests: this.computeSameInterestBonus(profile1, profile2),
    };

    return new Match({ owner: profile1, target: profile2, scores });
  }

  private computeLanguageLevel(profile1: Profile, profile2: Profile, isDiscovery = false): number {
    const levelsCount = isDiscovery ? 6 : 5;

    const languageLevelMatrix: { [key: string]: { [key: string]: number } } = {
      A0: { A0: 0, A1: 1, A2: 1, B1: 2, B2: 2, C1: 2, C2: 2 },
      A1: { A0: 1, A1: 2, A2: 2, B1: 3, B2: 3, C1: 3, C2: 3 },
      A2: { A0: 1, A1: 2, A2: 2, B1: 4, B2: 4, C1: 4, C2: 4 },
      B1: { A0: 2, A1: 3, A2: 4, B1: 5, B2: 5, C1: 5, C2: 5 },
      B2: { A0: 2, A1: 3, A2: 4, B1: 5, B2: 5, C1: 5, C2: 5 },
      C1: { A0: 2, A1: 3, A2: 4, B1: 5, B2: 5, C1: 5, C2: 5 },
      C2: { A0: 2, A1: 3, A2: 4, B1: 5, B2: 5, C1: 5, C2: 5 },
    };

    const discoveryLanguageLevelMatrix: { [key: string]: { [key: string]: number } } = {
      A0: { A0: 0, A1: 2, A2: 2, B1: 5, B2: 5, C1: 5, C2: 5 },
      A1: { A0: 2, A1: 2, A2: 2, B1: 5, B2: 5, C1: 5, C2: 5 },
      A2: { A0: 2, A1: 2, A2: 5, B1: 5, B2: 5, C1: 5, C2: 5 },
      B1: { A0: 6, A1: 6, A2: 5, B1: 4, B2: 4, C1: 4, C2: 4 },
      B2: { A0: 6, A1: 6, A2: 5, B1: 4, B2: 4, C1: 4, C2: 4 },
      C1: { A0: 6, A1: 6, A2: 5, B1: 4, B2: 4, C1: 4, C2: 4 },
      C2: { A0: 6, A1: 6, A2: 5, B1: 4, B2: 4, C1: 4, C2: 4 },
    };

    const level1 = profile1.languages.learning.level;
    const level2 = profile2.languages.learning.level;

    const level = isDiscovery ? discoveryLanguageLevelMatrix[level1][level2] : languageLevelMatrix[level1][level2];

    return this.coeficients.level * (level / levelsCount);
  }

  // Apply bunus if ages match criteria
  private computeAgeBonus(profile1: Profile, profile2: Profile): number {
    // Compute the absolute age difference between the two profiles
    const ageDiff: number = Math.abs(profile1.age - profile2.age);
    // If the age of the first profile is greater than 50
    if (profile1.age > 50) {
      // Apply the age bonus if the age of the second profile is greater than 45
      // If the second profile is 45 or younger, return the original score
      return profile2.age > 45 ? this.coeficients.age : 0;
    }
    // If the age of the first profile is greater than 30 (but not greater than 50,
    // because of the previous condition)
    if (profile1.age > 30) {
      // Apply the age bonus if the age difference between the profiles is between -10 and 10 (inclusive)
      // If the age difference is outside this range, return the original score
      return ageDiff >= -10 && ageDiff <= 10 ? this.coeficients.age : 0;
    }
    // If the age of the first profile is 30 or younger
    // Apply the age bonus if the age difference between the profiles is between -3 and 3 (inclusive)
    // If the age difference is outside this range, return the original score
    return ageDiff >= -3 && ageDiff <= 3 ? this.coeficients.age : 0;
  }

  // Apply bonus if profiles share the same status
  private computeSameRolesBonus(profile1: Profile, profile2: Profile): number {
    // If the status of the two profiles is the same apply a bonus to the score.
    if (profile1.role === profile2.role) {
      return this.coeficients.status;
    }

    return 0;
  }

  // Apply bonus if profiles dont share the same gender
  private computeSameGenderBonus(profile1: Profile, profile2: Profile): number {
    // Check if either profile prefers to be matched with someone of the same gender
    const prefersSameGender1 = profile1.preferences.sameGender;
    const prefersSameGender2 = profile2.preferences.sameGender;
    // Check if both profiles do not care about gender
    const doesNotCareAboutGender = !prefersSameGender1 && !prefersSameGender2;
    // Check if the genders of the two profiles match
    const gendersMatch = profile1.gender === profile2.gender;
    // Apply bonus if one profile prefer the same gender and their genders match,
    // or if both profiles do not care about gender
    if (
      ((prefersSameGender1 || prefersSameGender2) && gendersMatch) ||
      doesNotCareAboutGender
    ) {
      return this.coeficients.gender;
    }
    // Return the original score if none of the conditions for bonus apply
    return 0;
  }

  // Apply bonus if profiles share the same goals
  private computeSameGoalsBonus(profile1: Profile, profile2: Profile): number {
    const similarity = this.computeSimilarity(
      new Set(profile1.preferences.goals.map((goal) => goal.id)),
      new Set(profile2.preferences.goals.map((goal) => goal.id)),
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

  // Apply bonus if profiles share the same university
  private computeSameUniversityBonus(
    profile1: Profile,
    profile2: Profile,
  ): number {
    // Check if both profiles share the same university
    const sharesUniversity = profile1.university === profile2.university;

    // If both profiles share the same university, apply the bonus
    if (sharesUniversity) {
      return this.coeficients.university;
    }

    return 0;
  }

  // Compute the similarity between two sets of strings using the Jaccard index
  private computeSimilarity(set1: Set<string>, set2: Set<string>): number {
    const intersection = new Set([...set1].filter(x => set2.has(x)));
    const union = new Set([...set1, ...set2]);

    return intersection.size / union.size;
  }

  private applyBonus(currentScore: number, bonus: number): number {
    return Math.min(1, currentScore + bonus);
  }
}
