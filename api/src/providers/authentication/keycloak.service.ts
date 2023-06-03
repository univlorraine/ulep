import { AuthenticationService } from 'src/core/authentication/domain/authentication.service';
import * as jwt from 'jsonwebtoken';

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

export class KeycloakService implements AuthenticationService {
  // TODO: use config service
  private readonly baseURL: string;
  private readonly realm: string;

  constructor() {
    this.baseURL = process.env.KEYCLOAK_BASE_URL;
    this.realm = process.env.KEYCLOAK_REALM;
  }

  async authenticate(accessToken: string): Promise<string> {
    const token = jwt.decode(accessToken, { complete: true });

    const keyId = token.header.kid;

    const publicKey = await this.getPublicKey(keyId);

    return jwt.verify(accessToken, publicKey, {
      algorithms: ['RS256'],
    });
  }

  login(email: string, password: string): Promise<string> {
    throw new Error('Method not implemented.');
  }

  register(email: string, password: string): Promise<void> {
    throw new Error('Method not implemented.');
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
