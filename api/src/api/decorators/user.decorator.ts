import { KeycloakUserInfoResponse } from '@app/keycloak';
import { ExecutionContext, createParamDecorator } from '@nestjs/common';

export const User = createParamDecorator(
  (_, context: ExecutionContext): KeycloakUserInfoResponse => {
    const request = context.switchToHttp().getRequest();

    if (!request.user) {
      throw new Error('User not found');
    }

    return request.user;
  },
);
