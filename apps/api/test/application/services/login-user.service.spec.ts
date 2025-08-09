import { LoginUserService } from '../../../src/application/services/login-user.service';
import { UserRepository } from '../../../src/domain/repositories/user.repository.interface';
import { JwtService } from '@nestjs/jwt';
import { InvalidCredentialsException } from '../../../src/application/exceptions/invalid-credentials.exception';

describe('LoginUserService', () => {
  let service: LoginUserService;
  let repo: UserRepository;
  let jwt: JwtService;

  beforeEach(() => {
    repo = {
      findByEmail: jest.fn(),
      save: jest.fn(),
      getDefaultRole: jest.fn(),
    };
    jwt = { signAsync: jest.fn() } as any;
    service = new LoginUserService(repo, jwt);
  });

  it('throws if user not found', async () => {
    (repo.findByEmail as jest.Mock).mockResolvedValue(undefined);
    await expect(service.execute({ email: 'x@test.com', password: 'wrong' }))
      .rejects.toThrow(InvalidCredentialsException);
  });

  it('throws if password mismatch', async () => {
    (repo.findByEmail as jest.Mock).mockResolvedValue({ password: await require('bcrypt').hash('secret', 12), roles: [] });
    await expect(service.execute({ email: 'x@test.com', password: 'wrong' }))
      .rejects.toThrow(InvalidCredentialsException);
  });

  it('returns JWTToken on success', async () => {
    const hashed = await require('bcrypt').hash('secret', 12);
    (repo.findByEmail as jest.Mock).mockResolvedValue({ id: '1', email: 'foo', password: hashed, roles: [{ name: 'EMPLOYEE' }] });
    (jwt.signAsync as jest.Mock).mockResolvedValue('tok');
    const result = await service.execute({ email: 'foo', password: 'secret' });
    expect(result.accessToken).toBe('tok');
    expect(result.refreshToken).toBe('tok');
  });
});