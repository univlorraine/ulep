import { Inject, UnauthorizedException } from '@nestjs/common';
import { AuthenticationService } from '../domain/authentication.service';

export class LoginCommand {
  email: string;
  password: string;
}

export class LoginUsecase {
  constructor(
    @Inject('auth.service')
    private readonly authenticationService: AuthenticationService,
  ) {}

  async execute({ email, password }: LoginCommand): Promise<string> {
    try {
      return await this.authenticationService.login(email, password);
    } catch (e) {
      throw new UnauthorizedException();
    }
  }
}
