import { CalculatePayslipService } from '../../../src/application/services/calculate-payslip.service';
import { SalaryPolicy } from '../../../src/domain/entities/salary-policy.entity';
import { CalculatePayslipDto } from '../../../src/application/dto/calculate-payslip.dto';
import { InvalidPayrollDataException } from '../../../src/application/exceptions/invalid-payroll-data.exception';

describe('CalculatePayslipService', () => {
  let service: CalculatePayslipService;
  let policy: SalaryPolicy;

  beforeEach(() => {
    service = new CalculatePayslipService();
    policy = {
      id: 'sp1',
      name: 'Standard',
      baseHourlyRate: '10.00',
      nightShiftMultiplier: '1.25',
      weekendMultiplier: '1.5',
      bankHolidayMultiplier: '2.0',
    };
  });

  it('calculates correct grossPay and breakdown', async () => {
    const dto: CalculatePayslipDto = {
      userId: 'u1',
      salaryPolicyId: 'sp1',
      periodStart: '2023-01-01',
      periodEnd: '2023-01-07',
      regularHours: 30,
      nightHours: 10,
      weekendHours: 8,
      bankHolidayHours: 4,
    };
    const { grossPay, breakdown } = await service.execute(dto, policy);
    expect(grossPay).toBeDefined();
    expect(parseFloat(grossPay)).toBeGreaterThan(0);
    expect(Object.keys(breakdown)).toEqual(['regular', 'night', 'weekend', 'bankHoliday']);
  });

  it('throws on negative hours', async () => {
    const dto: CalculatePayslipDto = {
      userId: 'u2',
      salaryPolicyId: 'sp1',
      periodStart: '2023-01-01',
      periodEnd: '2023-01-07',
      regularHours: -1,
      nightHours: 0,
      weekendHours: 0,
      bankHolidayHours: 0,
    };
    await expect(service.execute(dto, policy)).rejects.toThrow(InvalidPayrollDataException);
  });

  it('calculates with zero optional hours', async () => {
    const dto: CalculatePayslipDto = {
      userId: 'u3',
      salaryPolicyId: 'sp1',
      periodStart: '2023-01-01',
      periodEnd: '2023-01-07',
      regularHours: 40,
      nightHours: 0,
      weekendHours: 0,
      bankHolidayHours: undefined,
    };
    const { grossPay } = await service.execute(dto, policy);
    expect(Number(grossPay)).toBeCloseTo(400);
  });
});