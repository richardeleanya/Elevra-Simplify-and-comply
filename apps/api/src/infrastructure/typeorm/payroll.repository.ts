import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payroll } from '../../domain/entities/payroll.entity';
import { PayrollRepository } from '../../domain/repositories/payroll.repository.interface';

@Injectable()
export class PayrollTypeormRepository implements PayrollRepository {
  constructor(
    @InjectRepository(Payroll)
    private readonly repo: Repository<Payroll>,
  ) {}

  async save(payroll: Payroll): Promise<Payroll> {
    return this.repo.save(payroll);
  }

  async findByUserId(userId: string): Promise<Payroll[]> {
    return this.repo
      .createQueryBuilder('payroll')
      .leftJoinAndSelect('payroll.user', 'user')
      .where('user.id = :userId', { userId })
      .getMany();
  }
}