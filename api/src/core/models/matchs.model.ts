import { DomainError } from '../errors';
import { LearningLanguagesMustContainsProfiles } from '../errors/match-exceptions';
import { LearningLanguage } from './learning-language.model';

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
  readonly gender: number;
  readonly university: number;
  readonly meetingFrequency: number;
  readonly certificateOption: number;

  constructor(props: {
    level: number;
    age: number;
    status: number;
    goals: number;
    interests: number;
    gender: number;
    university: number;
    meetingFrequency: number;
    certificateOption: number;
  }) {
    this.level = props.level;
    this.age = props.age;
    this.status = props.status;
    this.goals = props.goals;
    this.interests = props.interests;
    this.gender = props.gender;
    this.university = props.university;
    this.meetingFrequency = props.meetingFrequency;
    this.certificateOption = props.certificateOption;
  }

  static empty(): MatchScores {
    return new MatchScores({
      level: 0,
      age: 0,
      status: 0,
      goals: 0,
      interests: 0,
      gender: 0,
      university: 0,
      meetingFrequency: 0,
      certificateOption: 0,
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

    this.owner = props.owner;
    this.target = props.target;
    this.scores = props.scores;
    this.total = total;
  }
}
