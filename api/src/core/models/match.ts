import { Profile } from './profile';

export type CreateMatchProps = {
  owner: Profile;
  target: Profile;
  score: number;
};

export class Match {
  #owner: Profile;
  #target: Profile;
  #score: number;

  constructor(props: CreateMatchProps) {
    this.#owner = props.owner;
    this.#target = props.target;
    this.#score = props.score;
  }

  set owner(owner: Profile) {
    if (owner.id === this.#target.id) {
      throw new Error('Owner cannot be the same as target');
    }

    this.#owner = owner;
  }

  get owner() {
    return this.#owner;
  }

  set target(target: Profile) {
    if (target.id === this.#owner.id) {
      throw new Error('Target cannot be the same as owner');
    }

    this.#target = target;
  }

  get target() {
    return this.#target;
  }

  set score(score: number) {
    if (score < 0 || 1 < score) {
      throw new Error('Score must be between 0 and 1');
    }

    this.#score = score;
  }

  get score() {
    return this.#score;
  }
}
