import { Profile } from '../models/profile';
import { DomainEvent } from './event-bus';

export class NewProfileCreatedEvent implements DomainEvent {
  private constructor(public readonly profile: Profile) {}

  static fromProfile(profile: Profile): NewProfileCreatedEvent {
    return new NewProfileCreatedEvent(profile);
  }
}
