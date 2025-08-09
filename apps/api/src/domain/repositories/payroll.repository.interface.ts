import { Payroll } from '../entities/payroll.entity';

export interface PayrollRepository {
  save(payroll: Payroll): Promise<Payroll>;
  findByUserId(userId: string): Promise<Payroll[]>;
}