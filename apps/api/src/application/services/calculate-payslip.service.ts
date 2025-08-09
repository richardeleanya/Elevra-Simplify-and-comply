import { Injectable } from '@nestjs/common';
import { CalculatePayslipDto } from '../dto/calculate-payslip.dto';
import { SalaryPolicy } from '../../domain/entities/salary-policy.entity';
import { InvalidPayrollDataException } from '../exceptions/invalid-payroll-data.exception';
import { PayrollCalculationException } from '../exceptions/payroll-calculation.exception';
import { DecimalVO } from '../../domain/value-objects/decimal.vo';

@Injectable()
export class CalculatePayslipService {
  async execute(
    dto: CalculatePayslipDto,
    policy: SalaryPolicy,
  ): Promise<{ grossPay: string; breakdown: Record<string, string> }> {
    try {
      if (
        dto.regularHours < 0 ||
        dto.nightHours < 0 ||
        dto.weekendHours < 0 ||
        (dto.bankHolidayHours ?? 0) < 0
      ) {
        throw new InvalidPayrollDataException('Hours cannot be negative');
      }
      const base = new DecimalVO(policy.baseHourlyRate);
      const night = new DecimalVO(policy.nightShiftMultiplier);
      const weekend = new DecimalVO(policy.weekendMultiplier);
      const bankHoliday = policy.bankHolidayMultiplier
        ? new DecimalVO(policy.bankHolidayMultiplier)
        : new DecimalVO('0');

      const regularPay = base.mul(dto.regularHours);
      const nightPay = base.mul(night.toNumber()).mul(dto.nightHours);
      const weekendPay = base.mul(weekend.toNumber()).mul(dto.weekendHours);
      const bankHolidayPay = base
        .mul(bankHoliday.toNumber())
        .mul(dto.bankHolidayHours ?? 0);

      const gross = regularPay
        .add(nightPay)
        .add(weekendPay)
        .add(bankHolidayPay);

      const breakdown = {
        regular: regularPay.toString(),
        night: nightPay.toString(),
        weekend: weekendPay.toString(),
        bankHoliday: bankHolidayPay.toString(),
      };

      return {
        grossPay: gross.toString(),
        breakdown,
      };
    } catch (err) {
      if (err instanceof InvalidPayrollDataException) throw err;
      throw new PayrollCalculationException(err?.message);
    }
  }
}