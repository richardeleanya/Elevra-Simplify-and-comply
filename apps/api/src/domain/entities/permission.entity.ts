import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Unique,
} from 'typeorm';

export enum PermissionEnum {
  READ = 'READ',
  WRITE = 'WRITE',
  MANAGE_USERS = 'MANAGE_USERS',
  VIEW_PAYROLL = 'VIEW_PAYROLL',
  EDIT_PAYROLL = 'EDIT_PAYROLL',
  // ... more as needed
}

@Entity('permissions')
@Unique(['name'])
export class Permission {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'enum', enum: PermissionEnum })
  name: PermissionEnum;
}