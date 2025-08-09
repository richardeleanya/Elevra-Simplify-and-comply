import { User } from '../entities/user.entity';
import { RoleEnum, Role } from '../entities/role.entity';

export interface UserRepository {
  findByEmail(email: string): Promise<User | undefined>;
  save(user: User): Promise<User>;
  getDefaultRole(role: RoleEnum): Role;
}