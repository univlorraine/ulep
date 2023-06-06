// TODO: add attributes mappers in keycloak addministration
export interface KeycloakUserInfoResponse {
  sub: string;
  email: string;
  email_verified: boolean;
  origin?: string;
  roles?: string[];
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
