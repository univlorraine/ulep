import { faker } from '@faker-js/faker';
import { Role, User } from '../../src/core/models/user';

const seedDefinedNumberOfUsers = (
  count: number,
  id: (index: number) => string = (index: number) => `${index}`,
): User[] => {
  const users: User[] = [];
  let i = count;

  while (i > 0) {
    const instance = new User({
      id: id(i),
      email: faker.internet.email(),
      roles: [Role.ROLE_USER],
    });

    users.push(instance);

    i--;
  }

  return users;
};

export default seedDefinedNumberOfUsers;
