import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PensionModule } from '../../src/infrastructure/pension/pension.module';
import { PensionEnrolment } from '../../src/domain/entities/pension-enrolment.entity';
import * as request from 'supertest';

describe('PensionController (integration)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: ':memory:',
          dropSchema: true,
          entities: [PensionEnrolment],
          synchronize: true,
        }),
        PensionModule,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }));
    await app.init();
  });

  it('POST /pensions/enroll should create and submit enrolment', async () => {
    const res = await request(app.getHttpServer())
      .post('/pensions/enroll')
      .send({
        userId: 'user-1',
        enrollmentDate: '2025-08-10',
        payload: { pensionScheme: 'TestScheme' },
      })
      .expect(201);

    expect(res.body.id).toBeDefined();
    expect(res.body.status).toBe('SUBMITTED');
    expect(res.body.response.status).toBe('success');
  });

  it('GET /pensions/:userId should list enrolments', async () => {
    const res = await request(app.getHttpServer())
      .get('/pensions/user-1')
      .expect(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body[0].userId).toBe('user-1');
  });

  afterAll(async () => {
    if (app) await app.close();
  });
});