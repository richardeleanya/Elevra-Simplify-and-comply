import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JwtExpiredException } from '../exceptions/jwt-expired.exception';

@Injectable()
export class ValidateJwtService {
  constructor(private readonly jwtService: JwtService) {}

  async execute(token: string): Promise<any> {
    try {
      return await this.jwtService.verifyAsync(token);
    } catch (err) {
      if (err.name === 'TokenExpiredError') throw new JwtExpiredException();
      throw err;
    }
  }
}