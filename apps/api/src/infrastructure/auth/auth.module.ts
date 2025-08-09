import { Module, MiddlewareConsumer } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { APP_GUARD } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../../domain/entities/user.entity';
import { Role } from '../../domain/entities/role.entity';
import { Permission } from '../../domain/entities/permission.entity';
import { UserTypeormRepository } from '../typeorm/user.repository';
import { RegisterUserService } from '../../application/services/register-user.service';
import { LoginUserService } from '../../application/services/login-user.service';
import { ValidateJwtService } from '../../application/services/validate-jwt.service';
import { RefreshTokenService } from '../../application/services/refresh-token.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './jwt.strategy';
import { LocalStrategy } from './local.strategy';
import { JwtAuthGuard } from './jwt-auth.guard';
import { RolesGuard } from './roles.guard';
import { ConfigModule, ConfigService } from '@nestjs/config';
import helmet from 'helmet';
import * as csurf from 'csurf';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Role, Permission]),
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '15m' },
      }),
      inject: [ConfigService],
    }),
    ConfigModule,
  ],
  controllers: [AuthController],
  providers: [
    UserTypeormRepository,
    RegisterUserService,
    LoginUserService,
    ValidateJwtService,
    RefreshTokenService,
    LocalStrategy,
    JwtStrategy,
    { provide: 'UserRepository', useExisting: UserTypeormRepository },
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    { provide: APP_GUARD, useClass: RolesGuard },
  ],
  exports: [],
})
export class AuthModule {
  configure(consumer: MiddlewareConsumer) {
    // Apply helmet and csurf globally
    consumer
      .apply(helmet(), csurf())
      .forRoutes('*');
  }
}