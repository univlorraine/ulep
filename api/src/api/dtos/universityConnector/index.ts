import * as Swagger from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { UserUniversityInfo } from 'src/core/models/universityConnector.model';

export class ConnectorResponse {
  @Swagger.ApiProperty({ type: 'string' })
  @Expose({ groups: ['read'] })
  email: string;

  @Swagger.ApiProperty({ type: 'string' })
  @Expose({ groups: ['read'] })
  firstname: string;

  @Swagger.ApiProperty({ type: 'string' })
  @Expose({ groups: ['read'] })
  lastname: string;

  @Swagger.ApiProperty({ type: 'number' })
  @Expose({ groups: ['read'] })
  age?: number;

  @Swagger.ApiProperty({ type: 'string' })
  @Expose({ groups: ['read'] })
  gender?: string;

  @Swagger.ApiProperty({ type: 'string' })
  @Expose({ groups: ['read'] })
  role: string;

  @Swagger.ApiProperty({ type: 'string' })
  @Expose({ groups: ['read'] })
  diploma: string;

  @Swagger.ApiProperty({ type: 'string' })
  @Expose({ groups: ['read'] })
  departement: string;

  constructor(partial: Partial<ConnectorResponse>) {
    Object.assign(this, partial);
  }

  static fromDomain(userUniversity: UserUniversityInfo) {
    return new ConnectorResponse({
      email: userUniversity.email,
      firstname: userUniversity.firstname,
      lastname: userUniversity.lastname,
      age: userUniversity.age,
      gender: userUniversity.gender,
      role: userUniversity.role,
      diploma: userUniversity.diploma,
      departement: userUniversity.departement,
    });
  }
}
