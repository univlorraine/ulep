import { ApiProperty } from '@nestjs/swagger';
import { User } from '../../../core/models/user';
import { Expose } from 'class-transformer';

export class UserResponse {
  @ApiProperty({ readOnly: true })
  @Expose({ groups: ['read'] })
  id: string;

  @ApiProperty({ uniqueItems: true, example: 'mail@example.com' })
  @Expose({ groups: ['read'] })
  email: string;

  @ApiProperty()
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
