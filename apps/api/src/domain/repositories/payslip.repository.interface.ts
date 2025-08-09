import { Payslip } from '../entities/payslip.entity';
import { GeneratePayslipDto } from '../../application/dto/generate-payslip.dto';

export interface PayslipRepository {
  createFromDto(dto: GeneratePayslipDto): Payslip;
  save(payslip: Payslip): Promise<Payslip>;
  findByUserId(userId: string): Promise<Payslip[]>;
}