import { KeycloakGroup, UserRepresentation } from '@app/keycloak';
import * as Swagger from '@nestjs/swagger';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Expose, Transform, Type } from 'class-transformer';
import {
  IsBoolean,
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsNotEmptyObject,
  IsObject,
  IsOptional,
  IsString,
  IsUUID,
  Length,
  Min,
} from 'class-validator';
import { MediaObject } from 'src/core/models';
import {
  AdminGroup,
  Gender,
  Role,
  User,
  UserStatus,
} from 'src/core/models/user.model';
import { CreateUserCommand } from 'src/core/usecases/user';
import { LanguageResponse } from '../languages';
import { MediaObjectResponse } from '../medias';
import { UniversityResponse } from '../universities';

export interface UserRepresentationWithAvatar extends UserRepresentation {
  image?: MediaObject;
}

export class AdministratorsQuery {
  @ApiPropertyOptional({ type: 'string' })
  @IsOptional()
  universityId?: string;

  @ApiPropertyOptional({ type: 'string' })
  @IsOptional()
  firstname?: string;

  @ApiPropertyOptional({ type: 'string' })
  @IsOptional()
  lastname?: string;

  @ApiPropertyOptional({ type: 'string' })
  @IsOptional()
  email?: string;

  @ApiPropertyOptional({ type: 'string' })
  @IsOptional()
  groupId?: string;
}

export class CreateUserRequest implements CreateUserCommand {
  @Swagger.ApiProperty({ type: 'string', format: 'email' })
  @IsEmail()
  email: string;

  @Swagger.ApiPropertyOptional({ type: 'string', format: 'password' })
  @IsString()
  @IsOptional()
  password?: string;

  @Swagger.ApiProperty({ type: 'string' })
  @IsString()
  @IsNotEmpty()
  firstname: string;

  @Swagger.ApiProperty({ type: 'string' })
  @IsString()
  @IsNotEmpty()
  lastname: string;

  @Swagger.ApiProperty({ type: 'string', enum: Gender })
  @IsString()
  gender: Gender;

  @Swagger.ApiProperty({ type: 'number' })
  @Transform(({ value }) => Number(value))
  @IsInt()
  @Min(1)
  age: number;

  @Swagger.ApiProperty({ type: 'string', format: 'uuid' })
  @IsUUID()
  university: string;

  @Swagger.ApiProperty({ type: 'string', enum: Role })
  @IsString()
  role: Role;

  @Swagger.ApiPropertyOptional({ type: 'string' })
  @IsString()
  @IsOptional()
  code?: string;

  @Swagger.ApiProperty({ type: 'string', example: 'FR' })
  @IsString()
  @Length(2, 2)
  countryCode: string;

  @Swagger.ApiPropertyOptional({ type: 'string' })
  @IsString()
  @IsOptional()
  division?: string;

  @Swagger.ApiPropertyOptional({ type: 'string' })
  @IsString()
  @IsOptional()
  diploma?: string;

  @Swagger.ApiPropertyOptional({ type: 'string' })
  @IsString()
  @IsOptional()
  staffFunction?: string;
}

export class UpdateUserRequest {
  @Swagger.ApiPropertyOptional({ type: 'string', format: 'email' })
  @IsEmail()
  @IsOptional()
  email?: string;

  @Swagger.ApiPropertyOptional({ type: 'string' })
  @IsString()
  @IsOptional()
  firstname?: string;

  @Swagger.ApiPropertyOptional({ type: 'string' })
  @IsString()
  @IsOptional()
  lastname?: string;

  @Swagger.ApiProperty({ type: 'string', enum: Gender })
  @IsString()
  @IsOptional()
  gender?: Gender;

  @Swagger.ApiProperty({ type: 'number' })
  @Transform(({ value }) => Number(value))
  @IsInt()
  @Min(1)
  @IsOptional()
  age?: number;

  @Swagger.ApiProperty({ type: 'string', enum: UserStatus })
  @IsOptional()
  status?: UserStatus;

  @Swagger.ApiProperty({ type: 'boolean' })
  @IsOptional()
  @IsBoolean()
  acceptsEmail: boolean;

  @Swagger.ApiProperty({ type: 'string' })
  @IsOptional()
  contactId?: string;
}

export class KeycloakGroupResponse {
  @Swagger.ApiProperty({ type: 'string', format: 'uuid' })
  @Expose({ groups: ['read'] })
  id: string;

  @Swagger.ApiProperty({ type: 'string' })
  @Expose({ groups: ['read'] })
  name: string;

  @Swagger.ApiProperty({ type: 'string' })
  @Expose({ groups: ['read'] })
  path: string;

  constructor(partial: Partial<KeycloakGroupResponse>) {
    Object.assign(this, partial);
  }

  static fromDomain(group: KeycloakGroup) {
    return new KeycloakGroupResponse({
      id: group.id,
      name: group.name,
      path: group.path,
    });
  }
}

export class AdministratorResponse {
  @Swagger.ApiProperty({ type: 'string', format: 'uuid' })
  @Expose({ groups: ['read'] })
  id: string;

  @Swagger.ApiProperty({ type: 'string', format: 'email' })
  @Expose({ groups: ['read'] })
  email: string;

  @Swagger.ApiProperty({ type: 'string' })
  @Expose({ groups: ['read'] })
  firstname: string;

  @Swagger.ApiProperty({ type: 'string' })
  @Expose({ groups: ['read'] })
  lastname: string;

  @Swagger.ApiProperty({ type: 'string', format: 'uuid' })
  @Expose({ groups: ['read'] })
  universityId?: string;

  @Swagger.ApiProperty({ type: 'string', format: 'uuid' })
  @Expose({ groups: ['read'] })
  languageId?: string;

  @Swagger.ApiProperty()
  @Expose({ groups: ['read'] })
  group?: KeycloakGroupResponse;

  @Swagger.ApiPropertyOptional({ type: () => MediaObjectResponse })
  @Expose({ groups: ['read'] })
  image?: MediaObjectResponse;

  @Swagger.ApiPropertyOptional({ type: LanguageResponse })
  @Expose({ groups: ['read'] })
  language?: LanguageResponse;

  constructor(partial: Partial<AdministratorResponse>) {
    Object.assign(this, partial);
  }

  static fromDomain(user: UserRepresentationWithAvatar) {
    const adminGroupNames = Object.values(AdminGroup) as string[];

    return new AdministratorResponse({
      id: user.id,
      email: user.email,
      universityId: user.attributes?.universityId?.[0],
      languageId: user.attributes?.languageId?.[0],
      language: user.language
        ? LanguageResponse.fromLanguage(user.language)
        : null,
      firstname: user.firstName,
      lastname: user.lastName,
      image: user.image
        ? MediaObjectResponse.fromMediaObject(user.image)
        : null,
      group: user.groups
        ? KeycloakGroupResponse.fromDomain(
            user.groups.find((group) => adminGroupNames.includes(group.name)),
          )
        : null,
    });
  }
}

class KeycloakGroupRequest implements KeycloakGroup {
  @Swagger.ApiProperty({ type: 'string' })
  @IsString()
  id: string;

  @Swagger.ApiProperty({ type: 'string' })
  @IsString()
  name: string;

  @Swagger.ApiProperty({ type: 'string' })
  @IsString()
  path: string;
}

export class CreateAdministratorRequest {
  @Swagger.ApiProperty({ type: 'string', format: 'email' })
  @IsEmail()
  email: string;

  @Swagger.ApiProperty({ type: 'string' })
  @IsString()
  firstname: string;

  @Swagger.ApiProperty({ type: 'string' })
  @IsString()
  lastname: string;

  @Swagger.ApiProperty({ type: 'string', format: 'uuid' })
  @IsUUID()
  universityId?: string;

  @Swagger.ApiProperty({ type: 'string', format: 'uuid' })
  @IsOptional()
  @IsUUID()
  languageId?: string;

  @Swagger.ApiProperty({ type: 'string' })
  @IsString()
  password: string;

  @Swagger.ApiProperty({ type: 'string' })
  @IsObject()
  @IsNotEmptyObject()
  @Type(() => KeycloakGroupRequest)
  group: KeycloakGroupRequest;
}

export class UpdateAdministratorRequest {
  @Swagger.ApiProperty({ type: 'string', format: 'uuid' })
  @IsUUID()
  id: string;

  @Swagger.ApiPropertyOptional({ type: 'string', format: 'email' })
  @IsOptional()
  email?: string;

  @Swagger.ApiPropertyOptional({ type: 'string' })
  @IsString()
  @IsOptional()
  firstname?: string;

  @Swagger.ApiPropertyOptional({ type: 'string' })
  @IsString()
  @IsOptional()
  lastname?: string;

  @Swagger.ApiPropertyOptional({ type: 'string', format: 'uuid' })
  @IsUUID()
  @IsOptional()
  universityId?: string;

  @Swagger.ApiProperty({ type: 'string', format: 'uuid' })
  @IsOptional()
  @IsUUID()
  languageId?: string;

  @Swagger.ApiPropertyOptional({ type: 'string' })
  @IsString()
  @IsOptional()
  password?: string;

  @Swagger.ApiProperty({ type: 'string' })
  @IsObject()
  group: KeycloakGroup;
}

export class AddDeviceRequest {
  @Swagger.ApiProperty({ type: 'string' })
  @IsString()
  token: string;

  @Swagger.ApiProperty({ type: 'boolean' })
  @IsBoolean()
  isAndroid: boolean;

  @Swagger.ApiProperty({ type: 'boolean' })
  @IsBoolean()
  isIos: boolean;
}

export class UserResponse {
  @Swagger.ApiProperty({ type: 'string', format: 'uuid' })
  @Expose({ groups: ['read'] })
  id: string;

  @Swagger.ApiProperty({ type: 'string', format: 'email' })
  @Expose({ groups: ['read'] })
  email: string;

  @Swagger.ApiProperty({ type: 'string' })
  @Expose({ groups: ['read'] })
  firstname: string;

  @Swagger.ApiProperty({ type: 'string' })
  @Expose({ groups: ['read'] })
  lastname: string;

  @Swagger.ApiProperty({ type: 'string' })
  @Expose({ groups: ['read'] })
  gender: string;

  @Swagger.ApiProperty({ type: 'number' })
  @Expose({ groups: ['read'] })
  age: number;

  @Swagger.ApiProperty()
  @Expose({ groups: ['read'] })
  university: UniversityResponse;

  @Swagger.ApiProperty({ type: 'string' })
  @Expose({ groups: ['read'] })
  role: string;

  @Swagger.ApiProperty({ type: 'string' })
  @Expose({ groups: ['read'] })
  division?: string;

  @Swagger.ApiProperty({ type: 'string' })
  @Expose({ groups: ['read'] })
  diploma?: string;

  @Swagger.ApiProperty({ type: 'string' })
  @Expose({ groups: ['read'] })
  staffFunction?: string;

  @Swagger.ApiProperty({ type: 'string', example: 'FR' })
  @Expose({ groups: ['read'] })
  country: string;

  @Swagger.ApiProperty({ type: 'string', enum: UserStatus })
  @Expose({ groups: ['read'] })
  status?: UserStatus;

  @Swagger.ApiPropertyOptional({ type: () => MediaObjectResponse })
  @Expose({ groups: ['read'] })
  avatar?: MediaObjectResponse;

  @Swagger.ApiPropertyOptional({ type: 'boolean' })
  @Expose({ groups: ['read'] })
  acceptsEmail: boolean;

  @Swagger.ApiPropertyOptional({ type: 'string' })
  @Expose({ groups: ['read'] })
  contactId?: string;

  @Swagger.ApiPropertyOptional({ type: () => AdministratorResponse })
  @Expose({ groups: ['read'] })
  contact?: AdministratorResponse;

  constructor(partial: Partial<UserResponse>) {
    Object.assign(this, partial);
  }

  static fromDomain(user: User) {
    return new UserResponse({
      id: user.id,
      email: user.email,
      firstname: user.firstname,
      lastname: user.lastname,
      gender: user.gender,
      age: user.age,
      university: UniversityResponse.fromUniversity(user.university),
      role: user.role,
      country: user.country.code,
      status: user.status,
      acceptsEmail: user.acceptsEmail,
      division: user.division,
      diploma: user.diploma,
      staffFunction: user.staffFunction,
      contactId: user.contactId,
      avatar: user.avatar
        ? MediaObjectResponse.fromMediaObject(user.avatar)
        : null,
    });
  }
}
