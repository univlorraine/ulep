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

import {
  BadRequestException,
  HttpException,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { Client, Issuer, TokenSet } from 'openid-client';
import * as qs from 'querystring';
import { AdminGroup } from 'src/core/models';
import { ApiAdmin, ApiUser } from 'src/core/models/user.model';
import {
  KeycloakConfiguration,
  KEYCLOAK_CONFIGURATION,
} from './keycloak.configuration';
import {
  InvalidCredentialsException,
  UnexpectedErrorException,
  UserPasswordNotValidException,
} from './keycloak.errors';
import RoleRepresentation, {
  CreateAdministratorProps,
  CreateUserProps,
  CredentialRepresentation,
  GetUsersProps,
  KeycloakCertsResponse,
  KeycloakEmailAction,
  KeycloakUser,
  OpenIdConfiguration,
  UpdateKeycloakUserPayload,
  UpdateKeycloakUserProps,
  UserRepresentation,
  UserSession,
} from './keycloak.models';

export interface Credentials {
  accessToken: string;
  refreshToken: string;
}

// Could be optimized by caching the admin access token and the public keys
// for a certain amount of time.
@Injectable()
export class KeycloakClient {
  private readonly logger = new Logger(KeycloakClient.name);

  private issuerClient?: Client;
  private tokenSet?: TokenSet;

  constructor(
    @Inject(KEYCLOAK_CONFIGURATION)
    private readonly configuration: KeycloakConfiguration,
  ) {}

  private async initialize(): Promise<void> {
    const keycloakIssuer = await Issuer.discover(
      `${this.configuration.baseUrl}/realms/${this.configuration.realm}`,
    );

    this.issuerClient = new keycloakIssuer.Client({
      client_id: this.configuration.clientId,
      client_secret: this.configuration.clientSecret,
    });

    await this.grantToken();
  }

  private async grantToken(): Promise<void> {
    this.tokenSet = await this.issuerClient.grant({
      grant_type: 'client_credentials',
    });
  }

  /*
   * Validates the access token and returns the payload
   */
  async authenticate(accessToken: string): Promise<KeycloakUser> {
    const token = jwt.decode(accessToken, { complete: true });

    const keyId = token.header.kid;

    const publicKey = await this.getPublicKey(keyId);

    return jwt.verify(accessToken, publicKey, {
      algorithms: ['RS256'],
    });
  }

  /*
   * Fetches the public key from Keycloak to sign the token
   */
  private async getPublicKey(keyId: string): Promise<string> {
    const response = await fetch(
      `${this.configuration.baseUrl}/realms/${this.configuration.realm}/protocol/openid-connect/certs`,
      { method: 'GET' },
    );

    const { keys }: KeycloakCertsResponse = await response.json();

    const key = keys.find((k) => k.kid === keyId);

    if (!key) {
      // Token is probably so old, Keycloak doesn't even advertise the corresponding public key anymore
      throw new InvalidCredentialsException();
    }

    const publicKey = `-----BEGIN CERTIFICATE-----\r\n${key.x5c}\r\n-----END CERTIFICATE-----`;

    return publicKey;
  }

  /*
   * Returns the access token and refresh token.
   * Throws HttpException (409) if the credentials are invalid.
   */
  async getCredentialsFromAuthorizationCode({
    authorizationCode,
    redirectUri,
  }: {
    authorizationCode: string;
    redirectUri: string;
  }): Promise<Credentials> {
    const response = await fetch(
      `${this.configuration.baseUrl}/realms/${this.configuration.realm}/protocol/openid-connect/token`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          code: authorizationCode,
          grant_type: 'authorization_code',
          client_id: this.configuration.clientId,
          client_secret: this.configuration.clientSecret,
          scope: 'openid offline_access email profile',
          redirect_uri: redirectUri,
        }),
      },
    );

    if (!response.ok) {
      this.logger.error(JSON.stringify(await response.json()));
      throw new InvalidCredentialsException();
    }

    const { access_token, refresh_token } = await response.json();

    return { accessToken: access_token, refreshToken: refresh_token };
  }

  /*
   * Returns the access token and refresh token.
   * Throws HttpException (409) if the credentials are invalid.
   */
  async getCredentials(email: string, password: string): Promise<Credentials> {
    const response = await fetch(
      `${this.configuration.baseUrl}/realms/${this.configuration.realm}/protocol/openid-connect/token`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          username: email,
          password: password,
          grant_type: 'password',
          client_id: this.configuration.clientId,
          client_secret: this.configuration.clientSecret,
          scope: 'openid offline_access email profile',
        }),
      },
    );

    if (!response.ok) {
      this.logger.error(JSON.stringify(await response.json()));
      throw new InvalidCredentialsException();
    }

    const { access_token, refresh_token } = await response.json();

    return { accessToken: access_token, refreshToken: refresh_token };
  }

  async executeActionEmail(
    actions: KeycloakEmailAction[],
    user: string,
    language: string,
    redirectUri?: string,
  ): Promise<void> {
    let url = `${this.configuration.baseUrl}/admin/realms/${this.configuration.realm}/users/${user}/execute-actions-email`;

    if (redirectUri) {
      const query = {
        redirect_uri: redirectUri,
        client_id: this.configuration.clientId,
      };

      url = `${url}?${qs.stringify(query)}`;
    }

    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Accept-Language': language,
        Authorization: `Bearer ${await this.getAccessToken()}`,
      },
      body: JSON.stringify(actions),
    });

    if (response.status === 404) {
      // Do not throw an error if the user is not found
      return;
    }

    if (response.status === 400) {
      throw new BadRequestException({ message: 'Invalid redirect uri.' });
    }

    if (!response.ok) {
      throw new HttpException({ message: 'Service unvailable' }, 500);
    }

    return;
  }

  /*
   * Set up a new password for the user.
   */
  async resetPassword(userId: string, password: string): Promise<void> {
    const response = await fetch(
      `${this.configuration.baseUrl}/admin/realms/${this.configuration.realm}/users/${userId}/reset-password`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${await this.getAccessToken()}`,
        },
        body: JSON.stringify({
          type: 'password',
          value: password,
          temporary: false,
        }),
      },
    );

    if (response.status === 404) {
      throw new BadRequestException({ message: 'User not found' });
    }

    if (!response.ok) {
      throw new HttpException({ message: 'Service unvailable' }, 500);
    }

    return;
  }

  /*
   * Refreshes the access token
   * Throws HttpException (401) if the credentials are invalid.
   */
  async refreshToken(refreshToken: string): Promise<Credentials> {
    const response = await fetch(
      `${this.configuration.baseUrl}/realms/${this.configuration.realm}/protocol/openid-connect/token`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          grant_type: 'refresh_token',
          client_id: this.configuration.clientId,
          client_secret: this.configuration.clientSecret,
          refresh_token: refreshToken,
        }),
      },
    );

    if (!response.ok) {
      this.logger.error(JSON.stringify(await response.json()));
      throw new InvalidCredentialsException();
    }

    const { access_token, refresh_token } = await response.json();

    return { accessToken: access_token, refreshToken: refresh_token };
  }

  async isAdmin(user: UserRepresentation): Promise<boolean> {
    const userGroups = await this.getUserGroups(user.id);
    return userGroups.some((group: { name: string }) =>
      Object.values(AdminGroup).includes(group.name as AdminGroup),
    );
  }

  async isApiUser(user: UserRepresentation): Promise<boolean> {
    const userGroups = await this.getUserGroups(user.id);
    return userGroups.some(
      (group: { name: string }) =>
        group.name === ApiUser || group.name === ApiAdmin,
    );
  }

  async isApiAdmin(user: UserRepresentation): Promise<boolean> {
    const userGroups = await this.getUserGroups(user.id);
    return userGroups.some(
      (group: { name: string }) => group.name === ApiAdmin,
    );
  }

  /*
   * Let Keycloak validate the access token and return the userinfo.
   */
  async userInfo(accessToken: string): Promise<KeycloakUser> {
    const response = await fetch(
      `${this.configuration.baseUrl}/realms/${this.configuration.realm}/protocol/openid-connect/userinfo`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );

    this.logger.verbose(response.status);

    if (response.status === 401) {
      throw new InvalidCredentialsException();
    }

    const userInfo = await response.json();

    return userInfo;
  }

  /*
   * Creates a new user in Keycloak.
   */
  async createUser(props: CreateUserProps): Promise<UserRepresentation> {
    const response = await fetch(
      `${this.configuration.baseUrl}/admin/realms/${this.configuration.realm}/users`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${await this.getAccessToken()}`,
        },
        body: JSON.stringify({
          email: props.email,
          firstName: props.firstName,
          lastName: props.lastName,
          enabled: props.enabled,
          emailVerified: props.emailVerified,
          credentials: [
            {
              type: 'password',
              value: props.password,
              temporary: false,
            },
          ],
          attributes: {
            origin: props.origin,
          },
        }),
      },
    );
    if (!response.ok) {
      const error = await response.json();
      this.logger.error(JSON.stringify(error));

      if (error.errorMessage === 'Password policy not met') {
        throw new UserPasswordNotValidException();
      }

      throw new UnexpectedErrorException();
    }

    const user = await this.getUserByEmail(props.email);

    if (!user) {
      return;
    }

    for (const role of props.roles) {
      await this.addRealmRoleToUser(user.id, role);
    }

    return user;
  }

  /*
   * Creates a new admin user in Keycloak.
   */
  async createAdministrator(
    props: CreateAdministratorProps,
  ): Promise<UserRepresentation> {
    const response = await fetch(
      `${this.configuration.baseUrl}/admin/realms/${this.configuration.realm}/users`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${await this.getAccessToken()}`,
        },
        body: JSON.stringify({
          email: props.email,
          firstName: props.firstname,
          lastName: props.lastname,
          enabled: true,
          attributes: {
            universityId: props.universityId,
            languageId: props.languageId,
          },
          groups: props.groups,
        }),
      },
    );

    if (!response.ok) {
      const result = await response.json();
      this.logger.error(JSON.stringify(result));
      throw new HttpException({ message: result }, 500);
    }

    const user = await this.getUserByEmail(props.email);

    return user;
  }

  /*
   * Updates an existing user in Keycloak.
   */
  async updateUser(
    props: UpdateKeycloakUserProps,
  ): Promise<UserRepresentation> {
    const payload: UpdateKeycloakUserPayload = {
      email: props.newEmail,
      firstName: props.newFirstName,
      lastName: props.newLastName,
      attributes: {
        universityId: props.universityId,
        universityLogin: props.universityLogin,
        languageId: props.languageId,
      },
    };

    const user = await this.getUserByEmail(
      props.previousEmail || props.newEmail,
    );
    props.id = user.id;

    if (props.password) {
      const passwordResponse = await fetch(
        `${this.configuration.baseUrl}/admin/realms/${this.configuration.realm}/users/${props.id}/reset-password`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${await this.getAccessToken()}`,
          },
          body: JSON.stringify({
            type: 'password',
            value: props.password,
            temporary: false,
          }),
        },
      );

      if (!passwordResponse.ok) {
        const result = await passwordResponse.json();
        this.logger.error(JSON.stringify(result));
        throw new HttpException({ message: result.error_description }, 500);
      }
    }

    const response = await fetch(
      `${this.configuration.baseUrl}/admin/realms/${this.configuration.realm}/users/${props.id}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${await this.getAccessToken()}`,
        },
        body: JSON.stringify(payload),
      },
    );

    if (!response.ok) {
      const result = await response.json();
      this.logger.error(JSON.stringify(result));
      throw new HttpException({ message: result.error_description }, 500);
    }

    const updatedAdmin = await this.getUserById(props.id, true);

    if (!props.groups?.[0]?.name) return updatedAdmin;

    // We have to update groups manually, because the update doesn't work for the "groups" UserRepresentation key
    // https://github.com/keycloak/keycloak/discussions/8552
    const existingGroups = updatedAdmin.groups;
    const groupsToSet = props.groups;

    groupsToSet.forEach((groupToSet) => {
      if (
        // If the group is not set and should be
        !existingGroups.some(
          (existingGroup) => existingGroup.id === groupToSet.id,
        )
      ) {
        this.addUserToAGroup(props.id, groupToSet.id);
      }
    });

    existingGroups.forEach((existingGroup) => {
      if (
        // If the group is set but should not be
        !groupsToSet.some((groupToSet) => groupToSet.id === existingGroup.id)
      ) {
        this.removeUserFromAGroup(props.id, existingGroup.id);
      }
    });

    return updatedAdmin;
  }

  /**
   * Delete user in Keycloak.
   **/
  async deleteUser(id: string): Promise<void> {
    await fetch(
      `${this.configuration.baseUrl}/admin/realms/${this.configuration.realm}/users/${id}`,
      {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${await this.getAccessToken()}`,
        },
      },
    );
  }

  /*
   * Retrieves all users from Keycloak
   * Params:
   *  - email: email of the user
   *  - first: pagination offset
   *  - max: maximum results size (defaults to 100)
   *  - enabled: boolean representing if user is enabled or not
   */
  async getUsers({
    id,
    email,
    first,
    max,
    enabled,
    attributes,
  }: GetUsersProps): Promise<UserRepresentation[]> {
    const url = new URL(
      `${this.configuration.baseUrl}/admin/realms/${this.configuration.realm}/users`,
    );

    if (id) {
      url.searchParams.append('id', id);
    }

    if (email) {
      url.searchParams.append('email', email);
    }

    if (enabled) {
      url.searchParams.append('enabled', enabled.toString());
    }

    if (first) {
      url.searchParams.append('first', first.toString());
    }

    if (max) {
      url.searchParams.append('max', max.toString());
    }

    if (attributes) {
      url.searchParams.append('q', `${attributes.key}:${attributes.value}`);
    }

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${await this.getAccessToken()}`,
      },
    });

    const users = await response.json();

    return users;
  }

  async getUsersCount(): Promise<number> {
    const url = new URL(
      `${this.configuration.baseUrl}/admin/realms/${this.configuration.realm}/users/count`,
    );

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${await this.getAccessToken()}`,
      },
    });

    const count = await response.json();

    return count;
  }

  async getUserById(
    userId: string,
    withGroups = false,
  ): Promise<UserRepresentation> {
    const url = `${this.configuration.baseUrl}/admin/realms/${this.configuration.realm}/users/${userId}`;
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${await this.getAccessToken()}`,
      },
    });

    if (!response.ok) {
      const result = await response.json();
      this.logger.error(JSON.stringify(result));
      throw new HttpException({ message: result }, response.status);
    }

    const user = await response.json();

    if (withGroups) {
      user.groups = await this.getUserGroups(user.id);
    }

    return user;
  }

  async getUserGroups(userId: string) {
    const url = `${this.configuration.baseUrl}/admin/realms/${this.configuration.realm}/users/${userId}/groups`;
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${await this.getAccessToken()}`,
      },
    });

    if (!response.ok) {
      const result = await response.json();
      this.logger.error(JSON.stringify(result));
      throw new HttpException({ message: result }, response.status);
    }

    return response.json();
  }

  async getUserByEmail(email: string): Promise<UserRepresentation> {
    const users = await this.getUsers({ email, max: 1 });

    if (users.length === 0) {
      return;
    }

    return users[0];
  }

  async getUserByUniversityLogin(login: string): Promise<UserRepresentation> {
    const users = await this.getUsers({
      attributes: {
        key: 'universityLogin',
        value: login,
      },
      max: 1,
    });

    if (users.length === 0) {
      return;
    }

    return users[0];
  }

  async getUserCredentials(id: string): Promise<CredentialRepresentation[]> {
    const url = `${this.configuration.baseUrl}/admin/realms/${this.configuration.realm}/users/${id}/credentials`;
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${await this.getAccessToken()}`,
      },
    });

    if (!response.ok || response.status !== 200) {
      const message = await response.json();
      throw new HttpException({ message: message }, response.status);
    }

    const credentials = await response.json();

    return credentials;
  }

  /*
   * Add user to a group
   */
  async addUserToAGroup(userId: string, groupId: string): Promise<void> {
    await fetch(
      `${this.configuration.baseUrl}/admin/realms/${this.configuration.realm}/users/${userId}/groups/${groupId}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${await this.getAccessToken()}`,
        },
      },
    );
  }

  /*
   * Remove user from a group
   */
  async removeUserFromAGroup(userId: string, groupId: string): Promise<void> {
    await fetch(
      `${this.configuration.baseUrl}/admin/realms/${this.configuration.realm}/users/${userId}/groups/${groupId}`,
      {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${await this.getAccessToken()}`,
        },
      },
    );
  }

  /*
   * Get all groups
   */
  async getAllGroups() {
    const url = `${this.configuration.baseUrl}/admin/realms/${this.configuration.realm}/groups`;
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${await this.getAccessToken()}`,
      },
    });

    if (!response.ok || response.status !== 200) {
      const message = await response.json();
      throw new HttpException({ message: message }, response.status);
    }

    const groups = await response.json();

    return groups;
  }

  /*
   * Add realm-level role mappings to the user
   */
  async addRealmRoleToUser(userId: string, roleName: string): Promise<void> {
    const role = await this.getRealmRole(roleName);

    await fetch(
      `${this.configuration.baseUrl}/admin/realms/${this.configuration.realm}/users/${userId}/role-mappings/realm`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${await this.getAccessToken()}`,
        },
        body: JSON.stringify([
          {
            id: role.id,
            name: role.name,
          },
        ]),
      },
    );
  }

  /*
   * Add realm-level role mappings to the user
   */
  async removeRealmRoleToUser(userId: string, roleName: string): Promise<void> {
    const role = await this.getRealmRole(roleName);

    await fetch(
      `${this.configuration.baseUrl}/admin/realms/${this.configuration.realm}/users/${userId}/role-mappings/realm`,
      {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${await this.getAccessToken()}`,
        },
        body: JSON.stringify([
          {
            id: role.id,
            name: role.name,
          },
        ]),
      },
    );
  }

  /*
   * Get administrators users
   */
  public async getAdministrators(): Promise<UserRepresentation[]> {
    const response = await fetch(
      `${this.configuration.baseUrl}/admin/realms/${this.configuration.realm}/roles/${this.configuration.adminRoleName}/users`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${await this.getAccessToken()}`,
        },
      },
    );

    if (!response.ok) {
      this.logger.error(JSON.stringify(await response.json()));
      throw new UnexpectedErrorException();
    }

    const administrators = await response.json();

    return administrators;
  }

  /*
   * Get a role by name
   */
  private async getRealmRole(roleName: string): Promise<RoleRepresentation> {
    const response = await fetch(
      `${this.configuration.baseUrl}/admin/realms/${this.configuration.realm}/roles/${roleName}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${await this.getAccessToken()}`,
        },
      },
    );

    const role = await response.json();

    return role;
  }

  /*
   * Get all roles for the realm
   */
  private async getRealmRoles(): Promise<RoleRepresentation[]> {
    const response = await fetch(
      `${this.configuration.baseUrl}/admin/realms/${this.configuration.realm}/roles`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${await this.getAccessToken()}`,
        },
      },
    );

    const roles = await response.json();

    return roles;
  }

  /*
   * Retrieves admin access token from Keycloak
   */
  public async getAccessToken(): Promise<string> {
    if (!this.tokenSet) {
      await this.initialize();
    }

    if (this.tokenSet.expired()) {
      await this.grantToken();
    }
    return this.tokenSet.access_token;
  }

  /**
   * Get standard flow URL
   * @param redirectUri
   * @returns
   */
  public async getStandardFlowUrl(redirectUri: string): Promise<string> {
    const configuration = await this.getMetadata();
    const endoint = configuration.authorization_endpoint;

    const params = new URLSearchParams({
      response_type: 'code',
      client_id: this.configuration.clientId,
      scope: 'openid offline_access email profile',
      redirect_uri: redirectUri,
    });

    return `${endoint}?${params.toString()}`;
  }

  /**
   * Authorization Server Metadata.
   * See https://datatracker.ietf.org/doc/html/rfc8414#section-3
   */
  public async getMetadata(): Promise<OpenIdConfiguration> {
    const response = await fetch(
      `${this.configuration.baseUrl}/realms/${this.configuration.realm}/.well-known/openid-configuration`,
      {
        method: 'GET',
      },
    );

    const metadata = await response.json();

    return metadata;
  }

  public async logoutUser(userId: string): Promise<void> {
    await fetch(
      `${this.configuration.baseUrl}/admin/realms/${this.configuration.realm}/users/${userId}/logout`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${await this.getAccessToken()}`,
        },
      },
    );
  }

  public async getUserSessions(userId: string): Promise<UserSession[]> {
    const response = await fetch(
      `${this.configuration.baseUrl}/admin/realms/${this.configuration.realm}/users/${userId}/sessions`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${await this.getAccessToken()}`,
        },
      },
    );

    const sessions = await response.json();

    return sessions;
  }

  public async globalLogout(): Promise<void> {
    await fetch(
      `${this.configuration.baseUrl}/admin/realms/${this.configuration.realm}/logout-all`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${await this.getAccessToken()}`,
        },
      },
    );
    await this.initialize();
  }
}
