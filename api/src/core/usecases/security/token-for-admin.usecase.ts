import { Credentials, KeycloakClient } from '@app/keycloak';
import { ForbiddenException, Inject, Injectable } from '@nestjs/common';
import {
  UNIVERSITY_REPOSITORY,
  UniversityRepository,
} from 'src/core/ports/university.repository';

export class TokenForAdminCommand {
  email: string;
  password: string;
}

@Injectable()
export class TokenForAdminUsecase {
  constructor(
    @Inject(UNIVERSITY_REPOSITORY)
    private readonly universityRepository: UniversityRepository,
    private readonly keycloakClient: KeycloakClient,
  ) {}

  async execute(command: TokenForAdminCommand): Promise<Credentials> {
    const centralUniversity =
      await this.universityRepository.findUniversityCentral();

    if (
      centralUniversity.domains.length > 0 &&
      centralUniversity.domains.some((domain) => command.email.includes(domain))
    ) {
      throw new ForbiddenException(
        'Central administrators must use SSO to login.',
      );
    }

    const credentials = await this.keycloakClient.getCredentials(
      command.email,
      command.password,
    );

    return credentials;
  }
}
