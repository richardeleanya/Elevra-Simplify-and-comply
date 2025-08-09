import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JwtExpiredException } from '../exceptions/jwt-expired.exception';
import { JWTToken } from '../../domain/value-objects/jwt-token.vo';

@Injectable()
export class RefreshTokenService {
  constructor(private readonly jwtService: JwtService) {}

  async execute(refreshToken: string): Promise<JWTToken> {
    try {
      const payload = await this.jwtService.verifyAsync(refreshToken);
      // Issue new tokens
      const accessToken = await this.jwtService.signAsync(
        {
          sub: payload.sub,
          email: payload.email,
          roles: payload.roles,
        },
        { expiresIn: '15m' },
      );
      const newRefreshToken = await this.jwtService.signAsync(payload, {
        expiresIn: '7d',
      });
      return new JWTToken(accessToken, newRefreshToken);
    } catch (err) {
      if (err.name === 'TokenExpiredError') throw new JwtExpiredException();
      throw err;
    }
  }
}