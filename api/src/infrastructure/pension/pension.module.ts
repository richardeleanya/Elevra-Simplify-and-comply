import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PensionEnrolment } from '../../domain/entities/pension-enrolment.entity';
import { PensionEnrolmentService } from '../../application/services/pension-enrolment.service';
import { PensionController } from '../controllers/pension.controller';

@Module({
  imports: [TypeOrmModule.forFeature([PensionEnrolment])],
  controllers: [PensionController],
  providers: [PensionEnrolmentService],
})
export class PensionModule {}