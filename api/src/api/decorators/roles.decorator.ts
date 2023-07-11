import { SetMetadata } from '@nestjs/common';
import { UserRole } from 'src/core/models/user';

export const Roles = (roles: UserRole[]) => SetMetadata('roles', roles);
