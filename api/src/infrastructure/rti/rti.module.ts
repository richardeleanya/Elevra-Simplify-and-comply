import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RtiSubmission } from '../../domain/entities/rti-submission.entity';
import { RtiSubmissionService } from '../../application/services/rti-submission.service';
import { RtiController } from '../controllers/rti.controller';

@Module({
  imports: [TypeOrmModule.forFeature([RtiSubmission])],
  controllers: [RtiController],
  providers: [RtiSubmissionService],
})
export class RtiModule {}