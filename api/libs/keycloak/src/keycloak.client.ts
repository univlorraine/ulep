import { Inject, Injectable, Logger } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import {
  KEYCLOAK_CONFIGURATION,
  KeycloakConfiguration,
} from './keycloak.configuration';
import {
  InvalidCredentialsException,
  UserAlreadyExistException,
} from './keycloak.errors';
import {
  CreateUserProps,
  KeycloakCertsResponse,
  KeycloakUserInfoResponse,
  UserRepresentation,
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

  constructor(
    @Inject(KEYCLOAK_CONFIGURATION)
    private readonly configuration: KeycloakConfiguration,
  ) {}

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

    if (!response.ok) {
      this.logger.error(JSON.stringify(await response.json()));
      throw new InvalidCredentialsException();
    }

    const userInfo = await response.json();

    return userInfo;
  }

  /*
   * Creates a new user in Keycloak
   */
  async createUser(props: CreateUserProps): Promise<void> {
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
            roles: props.roles,
            origin: props.origin,
          },
        }),
      },
    );

    if (!response.ok) {
      // TODO: parse error message from response
      throw new UserAlreadyExistException();
    }

    return;
  }

  /*
   * Retrieves all users from Keycloak
   */
  async getUsers(): Promise<UserRepresentation[]> {
    const response = await fetch(
      `${this.configuration.baseUrl}/admin/realms/${this.configuration.realm}/users`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${await this.getAccessToken()}`,
        },
      },
    );

    const users = await response.json();

    return users;
  }

  /*
   * Retrieves admin access token from Keycloak
   */
  private async getAccessToken(): Promise<string> {
    const response = await fetch(
      `${this.configuration.baseUrl}/realms/master/protocol/openid-connect/token`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          username: this.configuration.username,
          password: this.configuration.password,
          grant_type: 'password',
          client_id: 'admin-cli',
        }),
      },
    );

    const { access_token } = await response.json();

    return access_token;
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
}
