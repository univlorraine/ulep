import { KeycloakUser } from '@app/keycloak';
import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import {
  AUTHENTICATOR,
  AuthenticatorInterface,
} from '../services/authenticator.interface';
import { Reflector } from '@nestjs/core';

@Injectable()
export class AuthenticationGuard implements CanActivate {
  constructor(
    @Inject(AUTHENTICATOR)
    private readonly authenticator: AuthenticatorInterface,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException();
    }

    try {
      const user = await this.authenticate(token);
      request['user'] = user;

      const roles = this.reflector.get<string[]>('roles', context.getHandler());
      if (!roles) {
        return true;
      }

      return roles.some(
        (requiredRole) => user.realm_access.roles.indexOf(requiredRole) > -1,
      );
    } catch (error) {
      throw new UnauthorizedException();
    }
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }

  private async authenticate(token: string): Promise<KeycloakUser | null> {
    const userInfo = await this.authenticator.authenticate(token);

    return userInfo;
  }
}
