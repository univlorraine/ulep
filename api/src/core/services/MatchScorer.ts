import { JOKER_LANGUAGE_CODE, LearningType } from 'src/core/models';
/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { Match, MatchScores, ProficiencyLevel, Profile } from '../models';
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

  // TODO: Use interest categories similarity instead of interests
  // TODO(multipleLearningLanguage): manage multiple learning language
  public computeMatchScore(profile1: Profile, profile2: Profile): Match {
    if (profile1.id === profile2.id) {
      throw new SameProfilesError();
    }

    // TODO: include other cases in discovery mode (ex: learning asian language, low level in learning language).
    // Algorithm should be adapted to consider learingLanguages for both user in that case
    const profile1LearningLanguageIsDiscovery = profile1.learningLanguages?.[0]?.language.code === JOKER_LANGUAGE_CODE;
    const profile2LearningLanguageIsDiscovery = profile2.learningLanguages?.[0]?.language.code === JOKER_LANGUAGE_CODE;

    const languageIdsSpokenByProfile1 = [profile1.nativeLanguage, ...profile1.masteredLanguages].map(l => l.id);
    const languageIdsSpokenByProfile2 = [profile2.nativeLanguage, ...profile2.masteredLanguages].map(l => l.id);
   

    // Check compatibility between learning languages and known languages of profiles
    if (
      (!profile2LearningLanguageIsDiscovery && !languageIdsSpokenByProfile1.includes(profile2.learningLanguages?.[0]?.language.id))
      || (!profile1LearningLanguageIsDiscovery && !languageIdsSpokenByProfile2.includes(profile1.learningLanguages?.[0]?.language.id))
    ) {
      return new Match({ owner: profile1, target: profile2, scores: MatchScores.empty() });
    }

    // Check forbidden case of same gender
    if ((profile1.sameGender || profile2.sameGender)
      && profile1.user.gender !== profile2.user.gender
    ) {
      return new Match({ owner: profile1, target: profile2, scores: MatchScores.empty() });
    }

    // Check incompatibilities between learning types
    if (profile1.learningType !== profile2.learningType && (
        profile1.learningType !== LearningType.BOTH && profile2.learningType !== LearningType.BOTH
    )) {
      return new Match({ owner: profile1, target: profile2, scores: MatchScores.empty() });
    }

    // Check same campus if tandem
    if (
      profile1.learningType === LearningType.TANDEM
      && (
        (!profile1.campus || !profile2.campus)
        || (profile1.campus.id !== profile2.campus.id)
      )
     ) {
      return new Match({ owner: profile1, target: profile2, scores: MatchScores.empty() });
    }

    const scores: MatchScores = new MatchScores({
      level: this.computeLanguageLevel(profile1, profile2),
      age: this.computeAgeBonus(profile1, profile2),
      status: this.computeSameRolesBonus(profile1, profile2),
      goals: this.computeSameGoalsBonus(profile1, profile2),
      university: this.computeSameUniversityBonus(profile1, profile2),
      gender: this.computeSameGenderBonus(profile1, profile2),
      interests: this.computeSameInterestBonus(profile1, profile2),
    });

    return new Match({ owner: profile1, target: profile2, scores });
  }

  private computeLanguageLevel(profile1: Profile, profile2: Profile): number {
    const profile1LearningLanguageIsDiscovery = profile1.learningLanguages?.[0]?.language.code === JOKER_LANGUAGE_CODE;
    const learningScoreProfile1 = this.computeLearningScore(profile1, profile1LearningLanguageIsDiscovery);

    const profile2LearningLanguageIsDiscovery = profile2.learningLanguages?.[0]?.language.code === JOKER_LANGUAGE_CODE;
    const learningScoreProfile2 = this.computeLearningScore(profile2, profile2LearningLanguageIsDiscovery);


    return this.coeficients.level * ((learningScoreProfile1 + learningScoreProfile2) / 2);
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

  // Apply bonus if profiles dont share the same gender
  private computeSameGenderBonus(profile1: Profile, profile2: Profile): number {
    // Check if either profile prefers to be matched with someone of the same gender
    const prefersSameGender1 = profile1.sameGender;
    const prefersSameGender2 = profile2.sameGender;
    // Check if both profiles do not care about gender
    const doesNotCareAboutGender = !prefersSameGender1 && !prefersSameGender2;
    // Check if the genders of the two profiles match
    const gendersMatch = profile1.user.gender === profile2.user.gender;
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

  // Apply bonus if profiles share the same university
  private computeSameUniversityBonus(
    profile1: Profile,
    profile2: Profile,
  ): number {
    // Check if both profiles share the same university
    const sharesUniversity = profile1.user.university === profile2.user.university;

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

    if (union.size === 0) {
      return 0;
    }

    return intersection.size / union.size;
  }

  private computeLearningScore(profile1: Profile, isDiscovery: boolean): number {
    const levelsCount = isDiscovery ? 6 : 5;

    // TODO(herve): validate this matrix
    const languageLevelMatrix: { [key: string]: { [key: string]: number } } = {
      A0: { A0: 0, A1: 1, A2: 1, B1: 2, B2: 2, C1: 2, C2: 2 },
      A1: { A0: 1, A1: 2, A2: 2, B1: 3, B2: 3, C1: 3, C2: 3 },
      A2: { A0: 1, A1: 2, A2: 2, B1: 4, B2: 4, C1: 4, C2: 4 },
      B1: { A0: 2, A1: 3, A2: 4, B1: 5, B2: 5, C1: 5, C2: 5 },
      B2: { A0: 2, A1: 3, A2: 4, B1: 5, B2: 5, C1: 5, C2: 5 },
      C1: { A0: 2, A1: 3, A2: 4, B1: 5, B2: 5, C1: 5, C2: 5 },
      C2: { A0: 2, A1: 3, A2: 4, B1: 5, B2: 5, C1: 5, C2: 5 },
    };

    // TODO(herve): validate this matrix
    const discoveryLanguageLevelMatrix: { [key: string]: { [key: string]: number } } = {
      A0: { A0: 0, A1: 2, A2: 2, B1: 5, B2: 5, C1: 5, C2: 5 },
      A1: { A0: 2, A1: 2, A2: 2, B1: 5, B2: 5, C1: 5, C2: 5 },
      A2: { A0: 2, A1: 2, A2: 5, B1: 5, B2: 5, C1: 5, C2: 5 },
      B1: { A0: 6, A1: 6, A2: 5, B1: 4, B2: 4, C1: 4, C2: 4 },
      B2: { A0: 6, A1: 6, A2: 5, B1: 4, B2: 4, C1: 4, C2: 4 },
      C1: { A0: 6, A1: 6, A2: 5, B1: 4, B2: 4, C1: 4, C2: 4 },
      C2: { A0: 6, A1: 6, A2: 5, B1: 4, B2: 4, C1: 4, C2: 4 },
    };

    // TODO(multipleLearningLanguage): manage multiple learning language
    const level1 = profile1.learningLanguages?.[0]?.level;
    // We approximate native and mastered language of user equals to a level between B1 and C2.
    // Score matrix have the same score for all these profile2 levels so we take B2 arbitrary here.
    const level2 = ProficiencyLevel.B2

    const level = isDiscovery
      ? discoveryLanguageLevelMatrix[level1][level2]
      : languageLevelMatrix[level1][level2];

    return level / levelsCount;
  }
}
