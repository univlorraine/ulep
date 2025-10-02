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

import { Language } from 'src/core/models/language.model';

// TODO: add attributes mappers in keycloak addministration
export class KeycloakUser {
  sub: string;
  email: string;
  email_verified: boolean;
  realm_access: RealmAccess;
  universityId?: string;
  universityLogin?: string;
  given_name?: string;
  family_name?: string;
}

export type KeycloakGroup = {
  id: string;
  name: string;
  path: string;
};

export type KeycloakEmailAction =
  | 'VERIFY_EMAIL'
  | 'UPDATE_PASSWORD'
  | 'UPDATE_PROFILE';

export interface RealmAccess {
  roles: string[];
}

export interface UserRepresentation {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  emailVerified: boolean;
  userProfileMetadata: UserProfileMetadata;
  attributes: { [index: string]: string };
  groups?: KeycloakGroup[];
  language?: Language;
}

interface UserProfileMetadata {
  attributes: UserProfileAttributeMetadata[];
}

interface UserProfileAttributeMetadata {
  name: string;
  displayName: string;
  required: boolean;
  readOnly: boolean;
  annotations: { [index: string]: any };
  validators: { [index: string]: { [index: string]: any } };
}

interface Client {
  [index: string]: string[];
}

export default interface RoleRepresentation {
  id?: string;
  name?: string;
  description?: string;
  scopeParamRequired?: boolean;
  composite?: boolean;
  composites?: Composites;
  clientRole?: boolean;
  containerId?: string;
  attributes?: { [index: string]: string[] };
}

export enum KeycloakRealmRoles {
  ADMIN = 'admin',
  SUPER_ADMIN = 'super-admin',
  ANIMATOR = 'animator',
  MANAGER = 'manager',
}

export interface Composites {
  realm?: string[];
  client?: Client;
  application?: { [index: string]: string[] };
}

export interface RoleMappingPayload extends RoleRepresentation {
  id: string;
  name: string;
}

export interface KeycloakCertsResponse {
  keys: KeycloakKey[];
}

interface KeycloakKey {
  kid: string;
  x5c: string;
}

export interface CreateUserProps {
  email: string;
  password: string;
  enabled: boolean;
  emailVerified: boolean;
  firstName?: string;
  lastName?: string;
  roles: string[];
  origin?: string;
}

export interface CreateAdministratorProps {
  email: string;
  firstname: string;
  lastname: string;
  universityId?: string;
  languageId?: string;
  groups: string[];
}

export interface UpdateKeycloakUserProps {
  id: string;
  newFirstName?: string;
  newLastName?: string;
  newEmail?: string;
  previousEmail?: string;
  password?: string;
  universityId?: string;
  languageId?: string;
  universityLogin?: string;
  groups?: KeycloakGroup[];
  mimetype?: string;
}

export interface UpdateKeycloakUserPayload {
  email: string;
  firstName?: string;
  lastName?: string;
  credentials?: {
    type: string;
    value: string;
    temporary: boolean;
  }[];
  attributes?: {
    universityId: string;
    universityLogin: string;
    languageId: string;
    mimetype?: string;
  };
}

export interface GetUsersProps {
  id?: string;
  email?: string;
  first?: number;
  max?: number;
  enabled?: boolean;
  attributes?: {
    key: string;
    value: string;
  };
}

export interface OpenIdConfiguration {
  issuer: string;
  authorization_endpoint: string;
  token_endpoint: string;
  userinfo_endpoint?: string;
  jwks_uri: string;
  registration_endpoint?: string;
  scopes_supported?: string[];
  response_types_supported: string[];
  response_modes_supported?: string[];
  grant_types_supported?: string[];
  acr_values_supported?: string[];
  subject_types_supported: string[];
  id_token_signing_alg_values_supported: string[];
  id_token_encryption_alg_values_supported?: string[];
  id_token_encryption_enc_values_supported?: string[];
  userinfo_signing_alg_values_supported?: string[];
  userinfo_encryption_alg_values_supported?: string[];
  userinfo_encryption_enc_values_supported?: string[];
  request_object_signing_alg_values_supported?: string[];
  request_object_encryption_alg_values_supported?: string[];
  request_object_encryption_enc_values_supported?: string[];
  token_endpoint_auth_methods_supported?: string[];
  token_endpoint_auth_signing_alg_values_supported?: string[];
  display_values_supported?: string[];
  claim_types_supported?: string[];
  claims_supported?: string[];
  service_documentation?: string;
  ui_locales_supported?: string[];
  op_policy_uri?: string;
  op_tos_uri?: string;
  claims_locales_supported?: string[];
  claims_parameter_supported?: boolean;
  request_parameter_supported?: boolean;
  request_uri_parameter_supported?: boolean;
  require_request_uri_registration?: boolean;
  code_challenge_methods_supported?: string[];
}

export interface CredentialRepresentation {
  id?: string;
  type?: string;
  value?: string;
  temporary?: boolean;
  createdDate?: number;
}

export interface UserSession {
  id: string;
  username: string;
  userId: string;
  ipAddress: string;
  start: number;
  lastAccess: number;
  rememberMe: boolean;
  clients: Client[];
}
