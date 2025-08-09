import { RegisterUserService } from '../../../src/application/services/register-user.service';
import { UserRepository } from '../../../src/domain/repositories/user.repository.interface';
import { RegisterUserDto } from '../../../src/application/dto/register-user.dto';
import { UserAlreadyExistsException } from '../../../src/application/exceptions/user-already-exists.exception';

describe('RegisterUserService', () => {
  let service: RegisterUserService;
  let repo: UserRepository;

  beforeEach(() => {
    repo = {
      findByEmail: jest.fn(),
      save: jest.fn(),
      getDefaultRole: jest.fn(),
    };
    service = new RegisterUserService(repo);
  });

  it('should throw if user exists', async () => {
    (repo.findByEmail as jest.Mock).mockResolvedValue({});
    await expect(service.execute({ email: 'a@test.com', password: 'secret123' }))
      .rejects.toThrow(UserAlreadyExistsException);
  });

  it('should register user with hashed password and default role', async () => {
    (repo.findByEmail as jest.Mock).mockResolvedValue(undefined);
    (repo.getDefaultRole as jest.Mock).mockReturnValue({ id: 'r', name: 'EMPLOYEE', permissions: [] });
    (repo.save as jest.Mock).mockImplementation(u => Promise.resolve(u));
    const dto: RegisterUserDto = { email: 'b@test.com', password: 'password123' };
    const result = await service.execute(dto);
    expect(result.email).toBe(dto.email);
    expect(result.password).not.toBe(dto.password); // should be hashed
    expect(result.roles[0].name).toBe('EMPLOYEE');
  });
});