import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SalaryPolicy } from '../../domain/entities/salary-policy.entity';
import { SalaryPolicyController } from '../controllers/salary-policy.controller';

@Module({
  imports: [TypeOrmModule.forFeature([SalaryPolicy])],
  controllers: [SalaryPolicyController],
})
export class SalaryPolicyModule {}