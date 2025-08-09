import { Controller, Get } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SalaryPolicy } from '../../domain/entities/salary-policy.entity';
import { Repository } from 'typeorm';

@Controller('salary-policies')
export class SalaryPolicyController {
  constructor(
    @InjectRepository(SalaryPolicy)
    private readonly repo: Repository<SalaryPolicy>,
  ) {}

  @Get()
  async findAll() {
    return this.repo.find();
  }
}