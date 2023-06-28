import { ExecutionContext, createParamDecorator } from '@nestjs/common';

export const UserContext = createParamDecorator(
  (_, context: ExecutionContext): string => {
    const request = context.switchToHttp().getRequest();

    if (!request.user) {
      throw new Error('User not found');
    }

    return request.user;
  },
);
