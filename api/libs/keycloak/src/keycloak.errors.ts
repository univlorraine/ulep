import { HttpException } from '@nestjs/common';

export class KeycloakException extends HttpException {}

export class InvalidCredentialsException extends KeycloakException {
  constructor() {
    super('Invalid credentials', 401);
  }
}

export class UserAlreadyExistException extends KeycloakException {
  constructor() {
    super('User exists with same email', 409);
  }
}
