// TODO: add attributes mappers in keycloak addministration
export class KeycloakUser {
  sub: string;
  email: string;
  email_verified: boolean;
  realm_access: RealmAccess;
  universityId?: string;
}

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
  attributes: { [index: string]: string[] };
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

export interface Composites {
  realm?: string[];
  client?: { [index: string]: string[] };
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

export interface GetUsersProps {
  id?: string;
  email?: string;
  first?: number;
  max?: number;
  enabled?: boolean;
}
