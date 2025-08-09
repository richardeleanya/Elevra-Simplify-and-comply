import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RtiModule } from '../../src/infrastructure/rti/rti.module';
import { RtiSubmission } from '../../src/domain/entities/rti-submission.entity';
import * as request from 'supertest';

describe('RtiController (integration)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: ':memory:',
          dropSchema: true,
          entities: [RtiSubmission],
          synchronize: true,
        }),
        RtiModule,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }));
    await app.init();
  });

  it('POST /rti/submit should create and submit RTI', async () => {
    const res = await request(app.getHttpServer())
      .post('/rti/submit')
      .send({
        payrollId: 'payroll-1',
        submissionDate: '2025-08-10',
        payload: { rtiData: 'test' },
      })
      .expect(201);

    expect(res.body.id).toBeDefined();
    expect(res.body.status).toBe('SUBMITTED');
    expect(res.body.response.status).toBe('success');
  });

  it('GET /rti/:payrollId should list RTI submissions', async () => {
    const res = await request(app.getHttpServer())
      .get('/rti/payroll-1')
      .expect(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body[0].payrollId).toBe('payroll-1');
  });

  afterAll(async () => {
    if (app) await app.close();
  });
});