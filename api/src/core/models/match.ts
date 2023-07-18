import { DomainError } from '../errors/errors';
import { Profile } from './profile';

export type CreateMatchProps = {
  owner: Profile;
  target: Profile;
  scores: MatchScores;
};

export type MatchScores = {
  level: number;
  age: number;
  status: number;
  goals: number;
  interests: number;
  gender: number;
  university: number;
};

export class Match {
  #owner: Profile;
  #target: Profile;
  #scores: MatchScores;
  #total: number;

  constructor(props: CreateMatchProps) {
    if (props.owner.id === props.target.id) {
      throw new DomainError('Owner cannot be the same as target');
    }

    let total = Object.values(props.scores).reduce((a, b) => a + b, 0);
    total = parseFloat(total.toFixed(2));

    if (total < 0 || 1 < total) {
      throw new DomainError(
        `The sum of all scores must be between 0 and 1, got ${total}.`,
      );
    }

    this.#owner = props.owner;
    this.#target = props.target;
    this.#scores = props.scores;
    this.#total = total;
  }

  get owner() {
    return this.#owner;
  }

  get target() {
    return this.#target;
  }

  get scores(): MatchScores {
    return this.#scores;
  }

  get total(): number {
    return this.#total;
  }
}
