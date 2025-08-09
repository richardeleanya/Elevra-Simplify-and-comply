import { Injectable } from '@nestjs/common';
import { Repository, DataSource } from 'typeorm';
import { User } from '../../domain/entities/user.entity';
import { UserRepository } from '../../domain/repositories/user.repository.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { RoleEnum, Role } from '../../domain/entities/role.entity';

@Injectable()
export class UserTypeormRepository implements UserRepository {
  constructor(
    @InjectRepository(User)
    private readonly repo: Repository<User>,
    @InjectRepository(Role)
    private readonly roleRepo: Repository<Role>,
  ) {}

  async findByEmail(email: string): Promise<User | undefined> {
    return this.repo.findOne({ where: { email }, relations: ['roles'] });
  }

  async save(user: User): Promise<User> {
    return this.repo.save(user);
  }

  getDefaultRole(role: RoleEnum): Role {
    // Should be called only for default role assignment
    return this.roleRepo.create({ name: role });
  }
}