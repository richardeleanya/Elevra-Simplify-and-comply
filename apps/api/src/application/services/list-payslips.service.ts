import { Injectable } from '@nestjs/common';
import { PayslipRepository } from '../../domain/repositories/payslip.repository.interface';
import { Payslip } from '../../domain/entities/payslip.entity';

@Injectable()
export class ListPayslipsService {
  constructor(private readonly payslips: PayslipRepository) {}

  async execute(userId: string): Promise<Payslip[]> {
    return this.payslips.findByUserId(userId);
  }
}