import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import {
  AuthenticationStrategy,
  KeycloakUserInfoResponse,
} from './authentication.strategy';

interface KeycloakCertsResponse {
  keys: KeycloakKey[];
}

interface KeycloakKey {
  kid: string;
  x5c: string;
}

export class InvalidToken extends Error {
  constructor(keyId: string) {
    super(`Invalid public key ID ${keyId}`);
  }
}

@Injectable()
export class KeycloakAuthenticationStrategy implements AuthenticationStrategy {
  private readonly baseURL: string;
  private readonly realm: string;

  constructor() {
    this.baseURL = process.env.KEYCLOAK_BASE_URL;
    this.realm = process.env.KEYCLOAK_REALM;
  }

  async authenticate(accessToken: string): Promise<KeycloakUserInfoResponse> {
    try {
      const token = jwt.decode(accessToken, { complete: true });

      const keyId = token.header.kid;

      const publicKey = await this.getPublicKey(keyId);

      return jwt.verify(accessToken, publicKey, {
        algorithms: ['RS256'],
      });
    } catch (_) {
      throw new UnauthorizedException();
    }
  }

  /*
   * Fetches the public key from Keycloak to sign the token
   */
  private async getPublicKey(keyId: string): Promise<string> {
    const response = await fetch(
      `${this.baseURL}/realms/${this.realm}/protocol/openid-connect/certs`,
      { method: 'GET' },
    );

    const { keys }: KeycloakCertsResponse = await response.json();

    const key = keys.find((k) => k.kid === keyId);

    if (!key) {
      // Token is probably so old, Keycloak doesn't even advertise the corresponding public key anymore
      throw new InvalidToken(keyId);
    }

    const publicKey = `-----BEGIN CERTIFICATE-----\r\n${key.x5c}\r\n-----END CERTIFICATE-----`;

    return publicKey;
  }
}
