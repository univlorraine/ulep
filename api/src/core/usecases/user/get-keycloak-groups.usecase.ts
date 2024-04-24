import { KeycloakClient } from '@app/keycloak';
import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { RessourceDoesNotExist } from 'src/core/errors';
import {
  UNIVERSITY_REPOSITORY,
  UniversityRepository,
} from 'src/core/ports/university.repository';
import { CreateAdministratorCommand } from './create-administrator.usecase';

@Injectable()
export class GetKeycloakGroupsUsecase {
  constructor(private readonly keycloakClient: KeycloakClient) {}

  async execute() {
    const groups = await this.keycloakClient.getAllGroups();

    return groups;
  }
}
