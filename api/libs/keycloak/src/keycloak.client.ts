import {
  BadRequestException,
  HttpException,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
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
  KeycloakCertsResponse,
  KeycloakUserInfoResponse,
  UserRepresentation,
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
      `${this.configuration.baseUrl}/realms/master`,
    );

    this.issuerClient = new keycloakIssuer.Client({
      client_id: 'admin-cli',
      token_endpoint_auth_method: 'none',
    });

    this.tokenSet = await this.issuerClient.grant({
      grant_type: 'password',
      username: this.configuration.username,
      password: this.configuration.password,
    });
  }

  /*
   * Validates the access token and returns the payload
   */
  async authenticate(accessToken: string): Promise<KeycloakUserInfoResponse> {
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
  async userInfo(accessToken: string): Promise<KeycloakUserInfoResponse> {
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

    this.logger.debug(response.status);

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

    for (const role of props.roles) {
      await this.addRealmRoleToUser(user.id, role);
    }

    return user;
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

  async getUserById(id: string): Promise<UserRepresentation> {
    const users = await this.getUsers({ id, max: 1 });

    if (users.length === 0) {
      throw new Error('User not found');
    }

    return users[0];
  }

  async getUserByEmail(email: string): Promise<UserRepresentation> {
    const users = await this.getUsers({ email, max: 1 });

    if (users.length === 0) {
      throw new Error('User not found');
    }

    return users[0];
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
      this.issuerClient.refresh(this.tokenSet.refresh_token);
    }

    return this.tokenSet.access_token;
  }
}
