import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { User } from 'src/core/models/user';

export const UserContext = createParamDecorator(
  (_, context: ExecutionContext): User => {
    const request = context.switchToHttp().getRequest();

    if (!request.user) {
      throw new Error('User not found');
    }

    return request.user;
  },
);
