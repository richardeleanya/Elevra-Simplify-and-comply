import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ComplianceModule } from '../../src/infrastructure/compliance/compliance.module';
import { Alert } from '../../src/domain/entities/alert.entity';
import * as request from 'supertest';

describe('ComplianceController (integration)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: ':memory:',
          dropSchema: true,
          entities: [Alert],
          synchronize: true,
        }),
        ComplianceModule,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }));
    await app.init();
  });

  it('POST /compliance/alerts should create alerts and return health', async () => {
    const payload = [
      {
        source: 'test',
        content: 'Regulation change',
        date: new Date().toISOString(),
        type: 'REGULATION_UPDATE',
        severity: 'CRITICAL',
      },
      {
        source: 'test',
        content: 'Minor update',
        date: new Date().toISOString(),
        type: 'REGULATION_UPDATE',
        severity: 'INFO',
      },
    ];
    const res = await request(app.getHttpServer())
      .post('/compliance/alerts')
      .send(payload)
      .expect(201);
    expect(res.body.alerts.length).toBe(2);
    expect(res.body.health.score).toBeLessThan(100);
    expect(res.body.health.counts.CRITICAL).toBe(1);
    expect(res.body.health.counts.INFO).toBe(1);
  });

  it('GET /compliance/health should return current health score and counts', async () => {
    const res = await request(app.getHttpServer())
      .get('/compliance/health')
      .expect(200);
    expect(res.body.score).toBeDefined();
    expect(res.body.counts).toBeDefined();
  });

  afterAll(async () => {
    if (app) await app.close();
  });
});