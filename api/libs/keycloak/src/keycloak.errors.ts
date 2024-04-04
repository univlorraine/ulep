import { HttpException } from '@nestjs/common';

export class KeycloakException extends HttpException {}

export class InvalidCredentialsException extends KeycloakException {
  constructor() {
    super('Invalid credentials', 401);
  }
}

export class UnexpectedErrorException extends KeycloakException {
  constructor() {
    super('Unexpected error occurred', 500);
  }
}

export class UserPasswordNotValidException extends KeycloakException {
  constructor() {
    super('User password is not valid', 400);
  }
}
