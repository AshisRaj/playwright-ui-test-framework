import { faker } from '@faker-js/faker';

export const qaEnvData = {
  validUser: {
    username: faker.internet.username(),
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    email: faker.internet.email(),
    password: process.env.DB_PASSWORD || faker.internet.password(),
    phone: faker.phone.number(),
    userStatus: 1,
  },
  invalidUser: {
    username: '',
    email: 'invalidemail',
  },
  validCredentials: {
    username: faker.internet.username(),
    password: process.env.DB_PASSWORD2 || faker.internet.password(),
  },
  invalidCredentials: {
    username: 'invaliduser',
    password: 'wrongpassword',
  },
};
