import { Injectable } from '@nestjs/common';
import { SessionRepository } from 'src/core/ports/session.repository';
import { Session } from '../../../core/models';

@Injectable()
export class InMemorySessionRepository implements SessionRepository {
  #sessions: Session[] = [];

  init(sessions: Session[]): void {
    this.#sessions = sessions;
  }

  reset(): void {
    this.#sessions = [];
  }

  ofId(id: string): Promise<Session> {
    return Promise.resolve(this.#sessions.find((session) => session.id === id));
  }

  create(session: Session): Promise<Session> {
    this.#sessions.push(session);
    return Promise.resolve(session);
  }

  update(session: Session): Promise<Session> {
    this.#sessions = this.#sessions.map((t) =>
      t.id === session.id ? session : t,
    );
    return Promise.resolve(session);
  }

  cancel(id: string, comment?: string): Promise<Session> {
    const session = this.#sessions.find((t) => t.id === id);
    return Promise.resolve(session);
  }

  findAllByProfileId(profileId: string): Promise<Session[]> {
    return Promise.resolve(this.#sessions);
  }

  findSessionsOneDayFromBeingStarted(): Promise<Session[]> {
    return Promise.resolve(this.#sessions);
  }

  findSessionsFifteenMinutesFromBeingStarted(): Promise<Session[]> {
    return Promise.resolve(this.#sessions);
  }
}
