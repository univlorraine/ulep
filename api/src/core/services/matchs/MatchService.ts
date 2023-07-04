import { Injectable } from '@nestjs/common';
import { CEFRLevel, Profile } from '../../models/profile';

export type Coeficients = {
  level: number;
  age: number;
  status: number;
  goals: number;
  interests: number;
  gender: number;
  university: number;
  unpaired: number;
};

@Injectable()
export class MatchService {
  #coeficients: Coeficients = {
    level: 0.7,
    age: 0.0375,
    status: 0.0375,
    goals: 0.0375,
    interests: 0.0375,
    gender: 0.0375,
    university: 0.075,
    unpaired: 0.0375,
  };

  public set coeficients(coeficients: Coeficients) {
    const sum = Object.values(coeficients).reduce((a, b) => a + b, 0);
    if (sum !== 1) {
      throw new Error('The sum of all coeficients must be equal to 1');
    }
    this.#coeficients = coeficients;
  }

  public get coeficients(): Coeficients {
    return this.#coeficients;
  }

  public computeMatchScore(profile1: Profile, profile2: Profile): number {
    // If both profiles have the same native language, set score to 0
    if (profile1.nativeLanguage.code === profile2.nativeLanguage.code) {
      return 0;
    }

    const level1: number = this.normalizeCEFRLevel(
      profile1.learningLanguage.level,
    );

    const level2: number = this.normalizeCEFRLevel(
      profile2.learningLanguage.level,
    );

    // Compute initial score based on levels, similar levels give higher score
    let score = this.coeficients.level * (1 - Math.abs(level1 - level2));

    // Apply the bonus
    score = this.applyAgeBonus(profile1, profile2, score);
    score = this.applySameRolesBonus(profile1, profile2, score);
    score = this.applySameGoalsBonus(profile1, profile2, score);
    score = this.applySameGenderBonus(profile1, profile2, score);
    score = this.applySameUniversityBonus(profile1, profile2, score);
    score = this.applySameInterestBonus(profile1, profile2, score);
    // score = this.applyUnpairedLastSessionBonus(..., score);

    return score;
  }

  // Normalize CEFR level to a number between 0 and 1
  private normalizeCEFRLevel(level: CEFRLevel): number {
    switch (level) {
      case 'A1':
        return 0;
      case 'A2':
        return 0.2;
      case 'B1':
        return 0.4;
      case 'B2':
        return 0.6;
      case 'C1':
        return 0.8;
      case 'C2':
        return 1.0;
      default:
        throw new Error(`Unknown CEFR level: ${level}`);
    }
  }

  // Apply bunus if ages match criteria
  private applyAgeBonus(
    profile1: Profile,
    profile2: Profile,
    score: number,
  ): number {
    // Compute the absolute age difference between the two profiles
    const ageDiff: number = Math.abs(profile1.age - profile2.age);
    // If the age of the first profile is greater than 50
    if (profile1.age > 50) {
      // Apply the age bonus if the age of the second profile is greater than 45
      // If the second profile is 45 or younger, return the original score
      return profile2.age > 45
        ? this.applyBonus(score, this.coeficients.age)
        : score;
    }
    // If the age of the first profile is greater than 30 (but not greater than 50,
    // because of the previous condition)
    if (profile1.age > 30) {
      // Apply the age bonus if the age difference between the profiles is between -10 and 10 (inclusive)
      // If the age difference is outside this range, return the original score
      return -10 <= ageDiff && ageDiff <= 10
        ? this.applyBonus(score, this.coeficients.age)
        : score;
    }
    // If the age of the first profile is 30 or younger
    // Apply the age bonus if the age difference between the profiles is between -3 and 3 (inclusive)
    // If the age difference is outside this range, return the original score
    return -3 <= ageDiff && ageDiff <= 3
      ? this.applyBonus(score, this.coeficients.age)
      : score;
  }

  // Apply bonus if profiles share the same status
  private applySameRolesBonus(
    profile_1: Profile,
    profile_2: Profile,
    score: number,
  ): number {
    // If the status of the two profiles is the same apply a bonus to the score.
    if (profile_1.role === profile_2.role) {
      return this.applyBonus(score, this.coeficients.status);
    }

    return score;
  }

  // Apply bonus if profiles dont share the same gender
  private applySameGenderBonus(
    profile1: Profile,
    profile2: Profile,
    score: number,
  ): number {
    // Check if profile_1 prefers to be matched with someone of the same gender
    const prefersSameGender =
      profile1.preferences.sameGender && profile1.preferences.sameGender;
    // Check if both profiles do not care about gender
    const doesNotCareAboutGender =
      !profile1.preferences.sameGender && !profile2.preferences.sameGender;
    // Check if the genders of the two profiles match
    const gendersMatch = profile1.gender === profile2.gender;
    // Apply bonus if profile_1 prefers same gender and their genders match,
    // or if both profiles do not care about gender
    if ((prefersSameGender && gendersMatch) || doesNotCareAboutGender) {
      return this.applyBonus(score, this.coeficients.gender);
    }
    // Return the original score if none of the conditions for bonus apply
    return score;
  }

  // Apply bonus if profiles share the same goals
  private applySameGoalsBonus(
    profile1: Profile,
    profile2: Profile,
    score: number,
  ): number {
    const similarity = this.computeSimilarity(profile1.goals, profile2.goals);

    return this.applyBonus(score, this.coeficients.goals * similarity);
  }

  // Apply bonus if profiles share the same interests
  private applySameInterestBonus(
    profile1: Profile,
    profile2: Profile,
    score: number,
  ): number {
    const similarity = this.computeSimilarity(
      profile1.interests,
      profile2.interests,
    );

    return this.applyBonus(score, this.coeficients.interests * similarity);
  }

  // Apply bonus if profiles share the same university
  private applySameUniversityBonus(
    profile1: Profile,
    profile2: Profile,
    score: number,
  ): number {
    // TODO: Throw an exception if tandem and dont shares the same university
    // TODO: Check if profile2 is from 'UL'. in that case, we should apply the bonus anyway

    // Check if both profiles share the same university
    const sharesUniversity = profile1.university.id === profile2.university.id;

    // If both profiles share the same university, apply the bonus
    if (sharesUniversity) {
      return this.applyBonus(score, this.coeficients.university);
    }

    return score;
  }

  private applyUnpairedLastSessionBonus(
    profile2wasPairedLastSession: boolean,
    score: number,
  ): number {
    // Apply the bonus if profile2 was not paired last session
    if (!profile2wasPairedLastSession) {
      return this.applyBonus(score, this.coeficients.unpaired);
    }

    return score;
  }

  private computeSimilarity(set1: Set<string>, set2: Set<string>): number {
    const intersection = new Set([...set1].filter((x) => set2.has(x)));
    const union = new Set([...set1, ...set2]);

    if (union.size === 0) {
      return 0;
    }

    return intersection.size / union.size;
  }

  private applyBonus(currentScore: number, bonus: number): number {
    return Math.min(1, currentScore + bonus);
  }
}
