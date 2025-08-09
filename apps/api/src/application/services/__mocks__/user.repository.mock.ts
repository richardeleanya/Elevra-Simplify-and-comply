export class UserRepositoryMock {
  findByEmail = jest.fn();
  save = jest.fn();
  getDefaultRole = jest.fn();
}