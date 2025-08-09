import { UnauthorizedException } from '@nestjs/common';

export class JwtExpiredException extends UnauthorizedException {
  constructor() {
    super('JWT token has expired');
  }
}