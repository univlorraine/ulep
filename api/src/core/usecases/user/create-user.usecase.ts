/**
 *
 *   Copyright ou © ou Copr. Université de Lorraine, (2025)
 *
 *   Direction du Numérique de l'Université de Lorraine - SIED
 *
 *   Ce logiciel est un programme informatique servant à rendre accessible
 *   sur mobile et sur internet l'application ULEP (University Language
 *   Exchange Programme) aux étudiants et aux personnels des universités
 *   parties prenantes.
 *
 *   Ce logiciel est régi par la licence CeCILL 2.1, soumise au droit français
 *   et respectant les principes de diffusion des logiciels libres. Vous pouvez
 *   utiliser, modifier et/ou redistribuer ce programme sous les conditions
 *   de la licence CeCILL telle que diffusée par le CEA, le CNRS et INRIA
 *   sur le site "http://cecill.info".
 *
 *   En contrepartie de l'accessibilité au code source et des droits de copie,
 *   de modification et de redistribution accordés par cette licence, il n'est
 *   offert aux utilisateurs qu'une garantie limitée. Pour les mêmes raisons,
 *   seule une responsabilité restreinte pèse sur l'auteur du programme, le
 *   titulaire des droits patrimoniaux et les concédants successifs.
 *
 *   À cet égard, l'attention de l'utilisateur est attirée sur les risques
 *   associés au chargement, à l'utilisation, à la modification et/ou au
 *   développement et à la reproduction du logiciel par l'utilisateur étant
 *   donné sa spécificité de logiciel libre, qui peut le rendre complexe à
 *   manipuler et qui le réserve donc à des développeurs et des professionnels
 *   avertis possédant des connaissances informatiques approfondies. Les
 *   utilisateurs sont donc invités à charger et à tester l'adéquation du
 *   logiciel à leurs besoins dans des conditions permettant d'assurer la
 *   sécurité de leurs systèmes et/ou de leurs données et, plus généralement,
 *   à l'utiliser et à l'exploiter dans les mêmes conditions de sécurité.
 *
 *   Le fait que vous puissiez accéder à cet en-tête signifie que vous avez
 *   pris connaissance de la licence CeCILL 2.1, et que vous en avez accepté les
 *   termes.
 *
 */

import { KeycloakClient } from '@app/keycloak';
import { Inject, Injectable } from '@nestjs/common';
import { toZonedTime } from 'date-fns-tz';
import { RegistrationException, UnauthorizedOperation } from 'src/core/errors';
import { Gender, Role, User } from 'src/core/models';
import { CHAT_SERVICE } from 'src/core/ports/chat.service';
import {
  CountryRepository,
  COUNTRY_REPOSITORY,
} from 'src/core/ports/country.repository';
import { EmailGateway, EMAIL_GATEWAY } from 'src/core/ports/email.gateway';
import {
  UniversityRepository,
  UNIVERSITY_REPOSITORY,
} from 'src/core/ports/university.repository';
import {
  UserRepository,
  USER_REPOSITORY,
} from 'src/core/ports/user.repository';
import { ChatService } from 'src/providers/services/chat.service';

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
    @Inject(CHAT_SERVICE)
    private readonly chatService: ChatService,
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
      throw new RegistrationException('University does not exist');
    }

    const country = await this.countryRepository.ofCode(command.countryCode);
    if (!country) {
      throw new RegistrationException('Country code does not exist');
    }

    const isCodeValid =
      university.codes.length === 0 ||
      university.codes.some((codeToCheck) => codeToCheck === command.code);

    const isDomainValid =
      university.domains.length === 0 ||
      university.domains.some((domain) => command.email.includes(domain));

    if (
      university.codes.length > 0 &&
      university.domains.length === 0 &&
      !isCodeValid
    ) {
      throw new RegistrationException('Code is invalid');
    }

    if (
      university.domains.length > 0 &&
      university.codes.length === 0 &&
      !isDomainValid
    ) {
      throw new RegistrationException('Domain is invalid');
    }

    if (
      university.codes.length > 0 &&
      university.domains.length > 0 &&
      !isCodeValid &&
      !isDomainValid
    ) {
      throw new RegistrationException('Code is invalid');
    }

    const now = toZonedTime(new Date(), university.timezone);
    const admissionEndTimezoned = toZonedTime(
      university.admissionEnd,
      university.timezone,
    );
    const admissionStartTimezoned = toZonedTime(
      university.admissionStart,
      university.timezone,
    );

    if (admissionEndTimezoned < now || admissionStartTimezoned > now) {
      throw new RegistrationException('Registration unavailable');
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
    } else if (command.password && keycloakUser) {
      await this.keycloak.updateUser({
        id: keycloakUser.id,
        newEmail: keycloakUser.email,
        newFirstName: command.firstname,
        newLastName: command.lastname,
        password: command.password,
        universityId:
          keycloakUser.attributes?.universityId?.[0] || university.id,
        universityLogin: keycloakUser.attributes?.universityLogin?.[0],
        languageId: keycloakUser.attributes?.languageId?.[0],
      });
    }

    if (!keycloakUser) {
      throw new RegistrationException('User does not exist');
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
          contactId: university.defaultContactId,
        }),
      );

      if (university.defaultContactId) {
        await this.chatService.createConversation([
          university.defaultContactId,
          user.id,
        ]);
      }

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
    } else {
      throw new RegistrationException('User already exist');
    }

    return user;
  }
}
