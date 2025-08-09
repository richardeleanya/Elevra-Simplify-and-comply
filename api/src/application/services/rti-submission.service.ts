import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RtiSubmission, RtiSubmissionStatus } from '../../domain/entities/rti-submission.entity';
import { RtiSubmissionDto } from '../dto/rti-submission.dto';

@Injectable()
export class RtiSubmissionService {
  constructor(
    @InjectRepository(RtiSubmission)
    private readonly rtiRepo: Repository<RtiSubmission>,
  ) {}

  async submit(dto: RtiSubmissionDto): Promise<RtiSubmission> {
    const entity = this.rtiRepo.create({
      payrollId: dto.payrollId,
      submissionDate: dto.submissionDate,
      payload: dto.payload,
      status: RtiSubmissionStatus.PENDING,
    });
    const saved = await this.rtiRepo.save(entity);

    // Simulate call to HMRC RTI API (mock/stub)
    try {
      // Replace with real HTTP service in production!
      const mockResponse = { status: 'success', reference: 'RTI456' };
      saved.status = RtiSubmissionStatus.SUBMITTED;
      saved.response = mockResponse;
    } catch (err) {
      saved.status = RtiSubmissionStatus.FAILED;
      saved.response = { error: err.message || 'Unknown error' };
    }
    return this.rtiRepo.save(saved);
  }

  async findByPayroll(payrollId: string): Promise<RtiSubmission[]> {
    return this.rtiRepo.find({ where: { payrollId }, order: { createdAt: 'DESC' } });
  }
}