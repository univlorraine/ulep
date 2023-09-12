import { faker } from '@faker-js/faker';
import { Gender, Role, User } from '../../../../../src/core/models';
import { ModelFactory } from './model.factory';
import { KeycloakUser } from '@app/keycloak';

const enumValue = <T>(_enum: unknown): T => {
  const entries = Object.entries(_enum).map(([, v]) => v.toUpperCase());
  return faker.helpers.arrayElement(entries) as T;
};

export class UserFactory extends ModelFactory<User> {
  getDefaults(): Partial<User> {
    return {
      id: faker.string.uuid(),
      email: faker.internet.email(),
      firstname: faker.person.firstName(),
      lastname: faker.person.lastName(),
      gender: enumValue(Gender),
      age: faker.number.int({ min: 16, max: 64 }),
      role: enumValue(Role),
      country: 'FR',
    };
  }
}

export class KeycloakUserFactory extends ModelFactory<{
  user: User;
  keycloakUser: KeycloakUser;
}> {
  getDefaults(): Partial<{ user: User; keycloakUser: KeycloakUser }> {
    const user = new UserFactory().makeOne();

    const keycloakUser: KeycloakUser = {
      sub: user.id,
      email: user.email,
      email_verified: true,
      realm_access: { roles: ['user'] },
    };

    return { user, keycloakUser };
  }
}
