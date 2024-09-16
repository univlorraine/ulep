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
  password: string;
  universityId?: string;
  groups: string[];
}

export interface UpdateAdministratorProps {
  id: string;
  firstname?: string;
  lastname?: string;
  email?: string;
  password?: string;
  universityId?: string;
  universityLogin?: string;
  groups?: KeycloakGroup[];
  mimetype?: string;
}

export interface UpdateAdministratorPayload {
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
