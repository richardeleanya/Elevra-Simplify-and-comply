import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AuthModule } from '../../../src/infrastructure/auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';

describe('AuthController (integration)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: ':memory:',
          entities: [__dirname + '/../../../src/domain/entities/*.entity.ts'],
          synchronize: true,
        }),
        AuthModule,
      ],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  it('registers, logs in, refreshes and gets profile', async () => {
    const email = `test@user.com`;
    const password = `password1234`;

    // Register
    await request(app.getHttpServer())
      .post('/auth/register')
      .send({ email, password })
      .expect(201);

    // Login
    const loginResp = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email, password })
      .expect(201);

    expect(loginResp.body.access_token).toBeDefined();
    expect(loginResp.body.refresh_token).toBeDefined();

    // Refresh
    const refreshResp = await request(app.getHttpServer())
      .post('/auth/refresh')
      .send({ refresh_token: loginResp.body.refresh_token })
      .expect(201);

    expect(refreshResp.body.access_token).toBeDefined();

    // Profile
    await request(app.getHttpServer())
      .get('/auth/profile')
      .set('Authorization', `Bearer ${loginResp.body.access_token}`)
      .expect(200);
  });

  afterAll(async () => {
    await app.close();
  });
});