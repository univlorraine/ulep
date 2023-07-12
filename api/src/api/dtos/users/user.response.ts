import { ApiProperty } from '@nestjs/swagger';
import { User, UserRole } from '../../../core/models/user';
import { Expose } from 'class-transformer';

export class UserResponse {
  @ApiProperty({
    type: 'string',
    format: 'uuid',
    readOnly: true,
  })
  @Expose({ groups: ['read'] })
  id: string;

  @ApiProperty({
    type: 'string',
    format: 'email',
    example: 'mail@example.com',
  })
  @Expose({ groups: ['read'] })
  email: string;

  @ApiProperty({ enum: UserRole, isArray: true })
  @Expose({ groups: ['user:read'] })
  roles: string[];

  constructor(partial: Partial<UserResponse>) {
    Object.assign(this, partial);
  }

  static fromDomain(instance: User): UserResponse {
    return new UserResponse({
      id: instance.id,
      email: instance.email,
      roles: instance.roles,
    });
  }
}
