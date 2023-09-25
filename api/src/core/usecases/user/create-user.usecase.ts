import { KeycloakClient } from '@app/keycloak';
import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { RessourceDoesNotExist } from 'src/core/errors';
import { Gender, Role } from 'src/core/models';
import {
  COUNTRY_REPOSITORY,
  CountryRepository,
} from 'src/core/ports/country.repository';
import {
  UNIVERSITY_REPOSITORY,
  UniversityRepository,
} from 'src/core/ports/university.repository';
import {
  USER_REPOSITORY,
  UserRepository,
} from 'src/core/ports/user.repository';

export class CreateUserCommand {
  email: string;
  password: string;
  firstname: string;
  lastname: string;
  gender: Gender;
  age: number;
  university: string;
  role: Role;
  countryCode: string;
  code: string;
}

@Injectable()
export class CreateUserUsecase {
  constructor(
    private readonly keycloak: KeycloakClient,
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepository,
    @Inject(UNIVERSITY_REPOSITORY)
    private readonly universityRepository: UniversityRepository,
    @Inject(COUNTRY_REPOSITORY)
    private readonly countryRepository: CountryRepository,
  ) {}

  async execute(command: CreateUserCommand) {
    const university = await this.universityRepository.ofId(command.university);
    if (!university) {
      throw new RessourceDoesNotExist('University does not exist');
    }

    const country = await this.countryRepository.ofCode(command.countryCode);
    if (!country) {
      throw new RessourceDoesNotExist('Country code does not exist');
    }

    if (
      university.codes.length > 0 &&
      !university.codes.some((codeToCheck) => codeToCheck === command.code)
    ) {
      throw new BadRequestException('Code is invalid');
    }

    if (
      university.domains.length > 0 &&
      !university.domains.some((domain) => command.email.includes(domain))
    ) {
      throw new BadRequestException('Domain is invalid');
    }

    const now = new Date();
    if (university.admissionEnd < now || university.admissionStart > now) {
      throw new BadRequestException('Registration unavailable');
    }

    const keycloakUser = await this.keycloak.createUser({
      email: command.email,
      password: command.password,
      firstName: command.firstname,
      lastName: command.lastname,
      roles: ['USER'],
      enabled: true,
      emailVerified: false,
      origin: 'api',
    });

    let user = await this.userRepository.ofId(keycloakUser.id);
    if (!user) {
      user = await this.userRepository.create({
        id: keycloakUser.id,
        acceptsEmail: true,
        email: command.email,
        firstname: command.firstname,
        lastname: command.lastname,
        gender: command.gender,
        age: command.age,
        university: university,
        role: command.role,
        country: country.code,
      });
    }

    return user;
  }
}
