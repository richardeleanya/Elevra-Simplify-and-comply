import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Alert } from '../../domain/entities/alert.entity';
import { GenerateAlertsService } from '../../application/services/generate-alerts.service';
import { ComplianceController } from '../controllers/compliance.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Alert])],
  controllers: [ComplianceController],
  providers: [GenerateAlertsService],
})
export class ComplianceModule {}