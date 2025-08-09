import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payslip } from '../../domain/entities/payslip.entity';
import { PayslipRepository } from '../../domain/repositories/payslip.repository.interface';
import { GeneratePayslipDto } from '../../application/dto/generate-payslip.dto';

@Injectable()
export class PayslipTypeormRepository implements PayslipRepository {
  constructor(
    @InjectRepository(Payslip)
    private readonly repo: Repository<Payslip>,
  ) {}

  createFromDto(dto: GeneratePayslipDto): Payslip {
    return this.repo.create({
      payroll: { id: dto.payrollId } as any,
      payDate: new Date(dto.payDate),
      grossPay: dto.grossPay,
      netPay: dto.netPay,
      breakdown: dto.breakdown,
    });
  }

  async save(payslip: Payslip): Promise<Payslip> {
    return this.repo.save(payslip);
  }

  async findByUserId(userId: string): Promise<Payslip[]> {
    return this.repo
      .createQueryBuilder('payslip')
      .leftJoinAndSelect('payslip.payroll', 'payroll')
      .where('payroll.user_id = :userId', { userId })
      .getMany();
  }
}