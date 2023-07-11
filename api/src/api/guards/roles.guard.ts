import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { User, UserRole } from 'src/core/models/user';
import { KeycloakAuthenticator } from 'src/core/services/authentication/authenticator';

@Injectable()
export class RolesGuard implements CanActivate {
  private readonly logger = new Logger(RolesGuard.name);

  constructor(
    private readonly reflector: Reflector,
    private readonly authenticator: KeycloakAuthenticator,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const roles = this.reflector.get<UserRole[]>('roles', context.getHandler());

    // If no roles defined for this route, authorize access
    if (!roles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    // If no token is provided, deny access
    if (!token) {
      throw new UnauthorizedException();
    }

    let user: User | undefined;

    try {
      user = await this.authenticator.authenticate(token);
      // Save the user info in the request object
      request['user'] = user;
    } catch (_) {
      // If an error occurred during user info retrieval, deny access
      throw new UnauthorizedException();
    }

    const isUserGranted = this.hasRoles(user, roles);

    // If the user does not have the required roles, deny access
    if (!isUserGranted) {
      throw new UnauthorizedException();
    }

    // If everything is fine, authorize access
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }

  private hasRoles(user: User, roles: UserRole[]): boolean {
    return roles.every((role) => user.roles.includes(role));
  }
}
