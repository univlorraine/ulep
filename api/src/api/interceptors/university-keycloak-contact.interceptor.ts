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
  UniversityResponse,
  UserResponse,
} from 'src/api/dtos';

@Injectable()
export class UniversityKeycloakInterceptor implements NestInterceptor {
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
      const university = await this.getUniversityWithKeycloakContact(
        data.user.university,
      );
      return new ProfileResponse({
        ...data,
        user: new UserResponse({
          ...data.user,
          university,
        }),
      });
    }

    if (data instanceof UserResponse) {
      const university = await this.getUniversityWithKeycloakContact(
        data.university,
      );
      return new UserResponse({
        ...data,
        university,
      });
    }

    if (data instanceof UniversityResponse) {
      return this.getUniversityWithKeycloakContact(data);
    }

    return data;
  }

  private async getUniversityWithKeycloakContact(
    university: UniversityResponse,
  ) {
    if (university.defaultContactId) {
      const keycloakData = await this.keycloakClient.getUserById(
        university.defaultContactId,
      );
      return new UniversityResponse({
        ...university,
        defaultContactId: undefined,
        defaultContact: AdministratorResponse.fromDomain(keycloakData),
      });
    }
    return university;
  }
}
