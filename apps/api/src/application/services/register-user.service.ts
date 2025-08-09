import { Injectable } from '@nestjs/common';
import { RegisterUserDto } from '../dto/register-user.dto';
import { UserRepository } from '../../domain/repositories/user.repository.interface';
import { UserAlreadyExistsException } from '../exceptions/user-already-exists.exception';
import { Password } from '../../domain/value-objects/password.vo';
import { User } from '../../domain/entities/user.entity';
import { Role, RoleEnum } from '../../domain/entities/role.entity';

@Injectable()
export class RegisterUserService {
  constructor(private readonly users: UserRepository) {}

  async execute(dto: RegisterUserDto): Promise<User> {
    const existing = await this.users.findByEmail(dto.email);
    if (existing) {
      throw new UserAlreadyExistsException();
    }
    const password = await Password.fromPlain(dto.password);
    const user = new User();
    user.email = dto.email;
    user.password = password.toString();
    user.roles = [this.users.getDefaultRole(RoleEnum.EMPLOYEE)]; // Assign default role
    return this.users.save(user);
  }
}