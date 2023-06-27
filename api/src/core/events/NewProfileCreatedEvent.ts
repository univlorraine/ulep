import { Profile } from '../models/profile';

export class NewProfileCreatedEvent {
  private constructor(public readonly profile: Profile) {}

  static fromProfile(profile: Profile): NewProfileCreatedEvent {
    return new NewProfileCreatedEvent(profile);
  }
}
