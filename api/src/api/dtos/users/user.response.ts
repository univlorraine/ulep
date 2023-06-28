import { ApiProperty } from '@nestjs/swagger';
import { User } from '../../../core/models/user';

export class UserResponse {
  @ApiProperty({ readOnly: true })
  id: string;

  @ApiProperty({ uniqueItems: true, example: 'mail@example.com' })
  email: string;

  @ApiProperty()
  roles: string[];

  static fromDomain(instance: User): UserResponse {
    return {
      id: instance.id,
      email: instance.email,
      roles: instance.roles,
    };
  }
}
