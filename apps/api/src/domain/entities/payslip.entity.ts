import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { Payroll } from './payroll.entity';

@Entity('payslips')
export class Payslip {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Payroll, { eager: true })
  @JoinColumn({ name: 'payroll_id' })
  payroll: Payroll;

  @Column()
  payDate: Date;

  @Column({ type: 'numeric', precision: 12, scale: 2 })
  grossPay: string;

  @Column({ type: 'numeric', precision: 12, scale: 2 })
  netPay: string;

  @Column({ type: 'jsonb' })
  breakdown: Record<string, string>; // e.g. { regular: "xxx", night: "yyy", ... }

  @CreateDateColumn()
  issuedAt: Date;
}