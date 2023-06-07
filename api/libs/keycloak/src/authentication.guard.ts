import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { KeycloakClient } from './keycloak.client';

@Injectable()
export class AuthenticationGuard implements CanActivate {
  constructor(private readonly keycloak: KeycloakClient) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    if (token) {
      request['userinfo'] = await this.keycloak.userInfo(token);
      return true;
    }

    throw new UnauthorizedException();
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
