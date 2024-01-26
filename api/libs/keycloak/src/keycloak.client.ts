import {
  BadRequestException,
  HttpException,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import * as qs from 'querystring';
import {
  KEYCLOAK_CONFIGURATION,
  KeycloakConfiguration,
} from './keycloak.configuration';
import {
  InvalidCredentialsException,
  UserAlreadyExistException,
} from './keycloak.errors';
import RoleRepresentation, {
  CreateUserProps,
  GetUsersProps,
  KeycloakEmailAction,
  KeycloakCertsResponse,
  UserRepresentation,
  KeycloakUser,
  CreateAdministratorProps,
  UpdateAdministratorProps,
  UpdateAdministratorPayload,
  OpenIdConfiguration,
  CredentialRepresentation,
} from './keycloak.models';
import { Client, Issuer, TokenSet } from 'openid-client';

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
          scope: 'openid',
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
          scope: 'openid',
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
   * Throws HttpException (409) if the credentials are invalid.
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
      this.logger.error(JSON.stringify(await response.json()));
      throw new UserAlreadyExistException();
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
   * Creates a new user in Keycloak.
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
          credentials: [
            {
              type: 'password',
              value: props.password,
              temporary: false,
            },
          ],
          attributes: {
            universityId: props.universityId,
          },
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
  async updateAdministrator(
    props: UpdateAdministratorProps,
  ): Promise<UserRepresentation> {
    const payload: UpdateAdministratorPayload = {
      email: props.email,
      firstName: props.firstname,
      lastName: props.lastname,
      attributes: {
        universityId: props.universityId,
      },
    };

    if (props.password) {
      payload.credentials = [
        {
          type: 'password',
          value: props.password,
          temporary: false,
        },
      ];
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
      throw new HttpException({ message: result }, 500);
    }

    const updatedAdmin = await this.getUserById(props.id);

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

  async getUserById(userId: string): Promise<UserRepresentation> {
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
    return user;
  }

  async getUserByEmail(email: string): Promise<UserRepresentation> {
    const users = await this.getUsers({ email, max: 1 });

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
   * Add user to group
   */
  async addUserToAdministrators(userId: string): Promise<void> {
    await fetch(
      `${this.configuration.baseUrl}/admin/realms/${this.configuration.realm}/users/${userId}/groups/${this.configuration.adminGroupId}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${await this.getAccessToken()}`,
        },
      },
    );
  }

  async removeUserFromAdministrators(userId: string): Promise<void> {
    await fetch(
      `${this.configuration.baseUrl}/admin/realms/${this.configuration.realm}/users/${userId}/groups/${this.configuration.adminGroupId}`,
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
   * Get administrators users
   */
  public async getAdministrators(
    universityId?: string,
  ): Promise<UserRepresentation[]> {
    const response = await fetch(
      `${this.configuration.baseUrl}/admin/realms/${this.configuration.realm}/groups/${this.configuration.adminGroupId}/members`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${await this.getAccessToken()}`,
        },
      },
    );

    let administrators = await response.json();

    if (universityId) {
      administrators = administrators.filter(
        (administrator) =>
          administrator.attributes?.universityId == universityId,
      );
    }

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
      scope: 'openid',
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
}
