import { faker } from '@faker-js/faker';

export const devEnvData = {
  validUser: {
    username: faker.internet.username(),
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    email: faker.internet.email(),
    password: faker.internet.password(),
    phone: faker.phone.number(),
    userStatus: 1,
  },
  invalidUser: {
    username: '',
    email: 'invalidemail',
  },
  validCredentials: {
    username: faker.internet.username(),
    password: faker.internet.password(),
  },
  invalidCredentials: {
    username: 'invaliduser',
    password: 'wrongpassword',
  },
};
