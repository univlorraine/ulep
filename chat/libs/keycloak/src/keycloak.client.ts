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

import { Inject, Injectable, Logger } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import {
    KEYCLOAK_CONFIGURATION,
    KeycloakConfiguration,
} from './keycloak.configuration';
import { InvalidCredentialsException } from './keycloak.errors';
import {
    KeycloakCertsResponse,
    KeycloakUser,
    OpenIdConfiguration,
    UserSession,
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
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
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
    async getCredentials(
        email: string,
        password: string,
    ): Promise<Credentials> {
        const response = await fetch(
            `${this.configuration.baseUrl}/realms/${this.configuration.realm}/protocol/openid-connect/token`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
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

    /*
     * Refreshes the access token
     * Throws HttpException (401) if the credentials are invalid.
     */
    async refreshToken(refreshToken: string): Promise<Credentials> {
        const response = await fetch(
            `${this.configuration.baseUrl}/realms/${this.configuration.realm}/protocol/openid-connect/token`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
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
}
