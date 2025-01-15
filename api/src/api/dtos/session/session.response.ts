import * as Swagger from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { Session } from 'src/core/models/session.model';

export class SessionResponse {
  @Swagger.ApiProperty({ type: 'string', format: 'uuid' })
  @Expose({ groups: ['read'] })
  id: string;

  @Swagger.ApiProperty({ type: 'string', format: 'uuid' })
  @Expose({ groups: ['read'] })
  tandemId: string;

  @Swagger.ApiProperty({ type: 'string', format: 'date-time' })
  @Expose({ groups: ['read'] })
  startAt: Date;

  @Swagger.ApiProperty({ type: 'string' })
  @Expose({ groups: ['read'] })
  comment: string;

  @Swagger.ApiProperty({ type: 'string', format: 'date-time' })
  @Expose({ groups: ['read'] })
  cancelledAt: Date;

  constructor(partial: Partial<SessionResponse>) {
    Object.assign(this, partial);
  }

  static from(session: Session): SessionResponse {
    return new SessionResponse({
      id: session.id,
      tandemId: session.tandemId,
      startAt: session.startAt,
      comment: session.comment,
      cancelledAt: session.cancelledAt,
    });
  }
}
