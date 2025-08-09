import { Injectable } from '@nestjs/common';
import { GeneratePayslipDto } from '../dto/generate-payslip.dto';
import { Payslip } from '../../domain/entities/payslip.entity';
import { PayslipRepository } from '../../domain/repositories/payslip.repository.interface';

@Injectable()
export class GeneratePayslipService {
  constructor(private readonly payslips: PayslipRepository) {}

  async execute(dto: GeneratePayslipDto): Promise<Payslip> {
    const payslip = this.payslips.createFromDto(dto);
    return this.payslips.save(payslip);
  }
}