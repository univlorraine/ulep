import { Inject, Injectable } from '@nestjs/common';
import { User } from '../../models/user';
import { KeycloakClient } from '@app/keycloak';
import { UserRepository } from '../../ports/user.repository';
import { USER_REPOSITORY } from 'src/providers/providers.module';

@Injectable()
export class KeycloakAuthenticator {
  constructor(
    private readonly keycloak: KeycloakClient,
    @Inject(USER_REPOSITORY) private readonly userRepository: UserRepository,
  ) {}

  async authenticate(token: string): Promise<User> {
    const userInfo = await this.keycloak.authenticate(token);

    const user = await this.userRepository.ofId(userInfo.sub);

    if (user) return user;

    const newUser = User.signUp(userInfo.sub, userInfo.email);
    await this.userRepository.save(newUser);

    return newUser;
  }
}
