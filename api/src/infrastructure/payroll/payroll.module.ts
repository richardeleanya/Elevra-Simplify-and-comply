import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PayrollController } from '../controllers/payroll.controller';
import { SalaryPolicy } from '../../domain/entities/salary-policy.entity';
import { Payroll } from '../../domain/entities/payroll.entity';
import { Payslip } from '../../domain/entities/payslip.entity';
import { CalculatePayslipService } from '../../application/services/calculate-payslip.service';
import { GeneratePayslipService } from '../../application/services/generate-payslip.service';
import { ListPayslipsService } from '../../application/services/list-payslips.service';
import { PayslipTypeormRepository } from '../typeorm/payslip.repository';

@Module({
  imports: [TypeOrmModule.forFeature([SalaryPolicy, Payroll, Payslip])],
  controllers: [PayrollController],
  providers: [
    CalculatePayslipService,
    GeneratePayslipService,
    ListPayslipsService,
    { provide: 'PayslipRepository', useClass: PayslipTypeormRepository },
  ],
  exports: [],
})
export class PayrollModule {}