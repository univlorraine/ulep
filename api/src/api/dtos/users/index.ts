import * as Swagger from '@nestjs/swagger';
import { Expose, Transform } from 'class-transformer';
import {
  IsString,
  IsNotEmpty,
  IsUUID,
  IsEmail,
  IsInt,
  Min,
  Length,
  IsOptional,
  IsBoolean,
} from 'class-validator';
import { UniversityResponse } from '../universities';
import { CreateUserCommand } from 'src/core/usecases/user';
import { Gender, Role, User, UserStatus } from 'src/core/models/user.model';
import { MediaObjectResponse } from '../medias';
import { UserRepresentation } from '@app/keycloak';

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

  @Swagger.ApiProperty({ type: 'string', enum: UserStatus })
  @IsOptional()
  status?: UserStatus;

  @Swagger.ApiProperty({ type: 'boolean' })
  @IsOptional()
  @IsBoolean()
  acceptsEmail: boolean;
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

  constructor(partial: Partial<AdministratorResponse>) {
    Object.assign(this, partial);
  }

  static fromDomain(user: UserRepresentation) {
    return new AdministratorResponse({
      id: user.id,
      email: user.email,
      universityId: user.attributes?.universityId?.[0],
      firstname: user.firstName,
      lastname: user.lastName,
    });
  }
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
  @IsOptional()
  universityId?: string;

  @Swagger.ApiProperty({ type: 'string' })
  @IsString()
  password: string;
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

  @Swagger.ApiPropertyOptional({ type: 'string' })
  @IsString()
  @IsOptional()
  password?: string;
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

  @Swagger.ApiPropertyOptional({ type: MediaObjectResponse })
  @Expose({ groups: ['read'] })
  avatar?: MediaObjectResponse;

  @Swagger.ApiPropertyOptional({ type: 'boolean' })
  @Expose({ groups: ['read'] })
  acceptsEmail: boolean;

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
      country: user.country,
      status: user.status,
      acceptsEmail: user.acceptsEmail,
      division: user.division,
      diploma: user.diploma,
      staffFunction: user.staffFunction,
      avatar: user.avatar
        ? MediaObjectResponse.fromMediaObject(user.avatar)
        : null,
    });
  }
}
