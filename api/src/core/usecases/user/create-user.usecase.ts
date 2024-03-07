import { KeycloakClient } from '@app/keycloak';
import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { RessourceDoesNotExist, UnauthorizedOperation } from 'src/core/errors';
import { Gender, Role, User } from 'src/core/models';
import {
  COUNTRY_REPOSITORY,
  CountryRepository,
} from 'src/core/ports/country.repository';
import { EMAIL_GATEWAY, EmailGateway } from 'src/core/ports/email.gateway';
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
  password?: string;
  firstname: string;
  lastname: string;
  gender: Gender;
  age: number;
  university: string;
  role: Role;
  countryCode: string;
  code?: string;
  division?: string;
  diploma?: string;
  staffFunction?: string;
}

@Injectable()
export class CreateUserUsecase {
  private readonly logger = new Logger(CreateUserUsecase.name);

  constructor(
    private readonly keycloak: KeycloakClient,
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepository,
    @Inject(UNIVERSITY_REPOSITORY)
    private readonly universityRepository: UniversityRepository,
    @Inject(COUNTRY_REPOSITORY)
    private readonly countryRepository: CountryRepository,
    @Inject(EMAIL_GATEWAY)
    private readonly emailGateway: EmailGateway,
  ) {}

  async execute(command: CreateUserCommand): Promise<User> {
    const isBlacklisted = await this.userRepository.isBlacklisted(
      command.email,
    );
    if (isBlacklisted) {
      throw new UnauthorizedOperation();
    }

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

    let keycloakUser = await this.keycloak.getUserByEmail(command.email);
    if (command.password && !keycloakUser) {
      keycloakUser = await this.keycloak.createUser({
        email: command.email,
        password: command.password,
        firstName: command.firstname,
        lastName: command.lastname,
        roles: ['USER'],
        enabled: true,
        emailVerified: false,
        origin: 'api',
      });
    }

    if (!keycloakUser) {
      throw new RessourceDoesNotExist('User does not exist');
    }

    let user = await this.userRepository.ofId(keycloakUser.id);
    if (!user) {
      user = await this.userRepository.create(
        new User({
          id: keycloakUser.id,
          acceptsEmail: true,
          email: command.email,
          firstname: command.firstname,
          lastname: command.lastname,
          gender: command.gender.toUpperCase() as Gender,
          age: command.age,
          university: university,
          role: command.role.toUpperCase() as Role,
          country,
          division: command.division,
          diploma: command.diploma,
          staffFunction: command.staffFunction,
        }),
      );

      // Notify the university about the new registration
      if (user.university.notificationEmail) {
        try {
          await this.emailGateway.sendNewUserRegistrationNoticeEmail({
            to: user.university.notificationEmail,
            language: user.university.country.code.toLowerCase(),
            user: { ...user },
          });
        } catch (error) {
          console.error('Error sending registration notice email', error);
        }
      }
    }

    return user;
  }
}
