import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { PayrollModule } from '../../src/infrastructure/payroll/payroll.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SalaryPolicy } from '../../src/domain/entities/salary-policy.entity';
import { Payroll } from '../../src/domain/entities/payroll.entity';
import { Payslip } from '../../src/domain/entities/payslip.entity';
import * as request from 'supertest';

describe('PayrollController (integration)', () => {
  let app: INestApplication;
  let policyId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: ':memory:',
          dropSchema: true,
          entities: [SalaryPolicy, Payroll, Payslip],
          synchronize: true,
        }),
        PayrollModule,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }));
    await app.init();

    // Insert a salary policy for testing
    const repo = moduleFixture.get('SalaryPolicyRepository') ||
      moduleFixture.get('SalaryPolicy');
    const ormRepo = app.get('SalaryPolicyRepository') || app.get('SalaryPolicy');
    const salaryPolicy = ormRepo?.create
      ? ormRepo.create({
          name: 'Standard',
          baseHourlyRate: '10.00',
          nightShiftMultiplier: '1.25',
          weekendMultiplier: '1.5',
          bankHolidayMultiplier: '2.0',
        })
      : {
          name: 'Standard',
          baseHourlyRate: '10.00',
          nightShiftMultiplier: '1.25',
          weekendMultiplier: '1.5',
          bankHolidayMultiplier: '2.0',
        };
    const saved = await ormRepo.save(salaryPolicy);
    policyId = saved.id;
  });

  it('should calculate payslip', async () => {
    const dto = {
      userId: 'user-1',
      salaryPolicyId: policyId,
      periodStart: '2023-01-01',
      periodEnd: '2023-01-07',
      regularHours: 40,
      nightHours: 10,
      weekendHours: 8,
      bankHolidayHours: 4,
    };
    const res = await request(app.getHttpServer())
      .post('/payrolls/calculate')
      .send(dto)
      .expect(201)
      .expect(res => {
        expect(res.body.grossPay).toBeDefined();
        expect(res.body.breakdown).toBeDefined();
      });
  });

  let payslipId: string;
  it('should generate payslip', async () => {
    const dto = {
      payrollId: 'payroll-1',
      payDate: '2023-01-08',
      grossPay: '1000.00',
      netPay: '950.00',
      breakdown: { regular: '800.00', night: '100.00', weekend: '50.00', bankHoliday: '50.00' },
    };
    const res = await request(app.getHttpServer())
      .post('/payrolls')
      .send(dto)
      .expect(201);
    expect(res.body.id).toBeDefined();
    payslipId = res.body.id;
  });

  it('should list payslips for user', async () => {
    const res = await request(app.getHttpServer())
      .get('/payrolls')
      .query({ userId: 'user-1' })
      .expect(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  afterAll(async () => {
    if (app) await app.close();
  });
});