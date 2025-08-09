import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PensionEnrolment, PensionEnrolmentStatus } from '../../domain/entities/pension-enrolment.entity';
import { PensionEnrolmentDto } from '../dto/pension-enrolment.dto';

@Injectable()
export class PensionEnrolmentService {
  constructor(
    @InjectRepository(PensionEnrolment)
    private readonly pensionRepo: Repository<PensionEnrolment>,
  ) {}

  async enroll(dto: PensionEnrolmentDto): Promise<PensionEnrolment> {
    const entity = this.pensionRepo.create({
      userId: dto.userId,
      enrollmentDate: dto.enrollmentDate,
      payload: dto.payload,
      status: PensionEnrolmentStatus.PENDING,
    });
    const saved = await this.pensionRepo.save(entity);

    // Simulate call to HMRC API (mock/stub)
    try {
      // Replace with real HTTP service in production!
      const mockResponse = { status: 'success', reference: 'HMRC123' };
      saved.status = PensionEnrolmentStatus.SUBMITTED;
      saved.response = mockResponse;
    } catch (err) {
      saved.status = PensionEnrolmentStatus.FAILED;
      saved.response = { error: err.message || 'Unknown error' };
    }
    return this.pensionRepo.save(saved);
  }

  async findByUser(userId: string): Promise<PensionEnrolment[]> {
    return this.pensionRepo.find({ where: { userId }, order: { createdAt: 'DESC' } });
  }
}