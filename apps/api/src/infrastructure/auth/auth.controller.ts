import {
  Controller,
  Post,
  Body,
  Request,
  UseGuards,
  Get,
  Res,
} from '@nestjs/common';
import { RegisterUserDto } from '../../application/dto/register-user.dto';
import { LoginUserDto } from '../../application/dto/login-user.dto';
import { RegisterUserService } from '../../application/services/register-user.service';
import { LoginUserService } from '../../application/services/login-user.service';
import { ValidateJwtService } from '../../application/services/validate-jwt.service';
import { RefreshTokenService } from '../../application/services/refresh-token.service';
import { LocalAuthGuard } from './local-auth.guard';
import { JwtAuthGuard } from './jwt-auth.guard';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly registerUser: RegisterUserService,
    private readonly loginUser: LoginUserService,
    private readonly validateJwt: ValidateJwtService,
    private readonly refreshToken: RefreshTokenService,
  ) {}

  @Post('register')
  async register(@Body() dto: RegisterUserDto) {
    const user = await this.registerUser.execute(dto);
    return { id: user.id, email: user.email, roles: user.roles.map(r => r.name) };
  }

  @Post('login')
  async login(@Body() dto: LoginUserDto) {
    const token = await this.loginUser.execute(dto);
    return {
      access_token: token.accessToken,
      refresh_token: token.refreshToken,
    };
  }

  @Post('refresh')
  async refresh(@Body('refresh_token') refreshToken: string) {
    const token = await this.refreshToken.execute(refreshToken);
    return {
      access_token: token.accessToken,
      refresh_token: token.refreshToken,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async profile(@Request() req) {
    // Assumes JwtStrategy attaches user to req
    return req.user;
  }
}