import { Session } from '../models';

export const SESSION_REPOSITORY = 'session.repository';

export type CreateSessionProps = {
  startAt: Date;
  comment: string;
  tandemId: string;
};

export type UpdateSessionProps = {
  id: string;
  startAt: Date;
  comment: string;
};

export interface SessionRepository {
  ofId: (id: string) => Promise<Session | null>;

  create: (props: CreateSessionProps) => Promise<Session>;

  update: (props: UpdateSessionProps) => Promise<Session>;

  cancel: (id: string, comment?: string) => Promise<Session>;

  findAllByProfileId: (profileId: string) => Promise<Session[]>;

  findSessionsOneDayFromBeingStarted: () => Promise<Session[]>;

  findSessionsFifteenMinutesFromBeingStarted: () => Promise<Session[]>;
}
