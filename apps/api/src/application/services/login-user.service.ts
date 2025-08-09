import { Injectable } from '@nestjs/common';
import { LoginUserDto } from '../dto/login-user.dto';
import { UserRepository } from '../../domain/repositories/user.repository.interface';
import { InvalidCredentialsException } from '../exceptions/invalid-credentials.exception';
import { Password } from '../../domain/value-objects/password.vo';
import { JWTToken } from '../../domain/value-objects/jwt-token.vo';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class LoginUserService {
  constructor(
    private readonly users: UserRepository,
    private readonly jwtService: JwtService,
  ) {}

  async execute(dto: LoginUserDto): Promise<JWTToken> {
    const user = await this.users.findByEmail(dto.email);
    if (!user) throw new InvalidCredentialsException();

    const password = Password.fromHash(user.password);
    if (!(await password.matches(dto.password))) {
      throw new InvalidCredentialsException();
    }

    // JWT payload
    const payload = {
      sub: user.id,
      email: user.email,
      roles: user.roles.map(r => r.name),
    };
    const accessToken = await this.jwtService.signAsync(payload, {
      expiresIn: '15m',
    });
    const refreshToken = await this.jwtService.signAsync(payload, {
      expiresIn: '7d',
    });
    return new JWTToken(accessToken, refreshToken);
  }
}