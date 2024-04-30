import { KeycloakClient } from '@app/keycloak';
import {
  CallHandler,
  ExecutionContext,
  Inject,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  AdministratorResponse,
  ProfileResponse,
  UserResponse,
} from 'src/api/dtos';

@Injectable()
export class UserKeycloakContactInterceptor implements NestInterceptor {
  constructor(
    @Inject(KeycloakClient) private readonly keycloakClient: KeycloakClient,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map(async (data) => {
        return await this.handleResponseForPipe(data);
      }),
    );
  }

  private async handleResponseForPipe(data: any) {
    if (data instanceof ProfileResponse) {
      const user = await this.getUserWithKeycloakContact(data.user);
      return new ProfileResponse({
        ...data,
        user,
      });
    }

    if (data instanceof UserResponse) {
      return await this.getUserWithKeycloakContact(data);
    }

    return data;
  }

  private async getUserWithKeycloakContact(user: UserResponse) {
    if (user.contactId) {
      const keycloakData = await this.keycloakClient.getUserById(
        user.contactId,
      );
      return new UserResponse({
        ...user,
        contactId: undefined,
        contact: AdministratorResponse.fromDomain(keycloakData),
      });
    }
    return user;
  }
}
