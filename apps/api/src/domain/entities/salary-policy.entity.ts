import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Unique,
} from 'typeorm';

@Entity('salary_policies')
@Unique(['name'])
export class SalaryPolicy {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ type: 'numeric', precision: 12, scale: 2 })
  baseHourlyRate: string; // Decimal string

  @Column({ type: 'numeric', precision: 5, scale: 2 })
  nightShiftMultiplier: string; // e.g., "1.25" for 25% premium

  @Column({ type: 'numeric', precision: 5, scale: 2 })
  weekendMultiplier: string;

  @Column({ type: 'numeric', precision: 5, scale: 2, nullable: true })
  bankHolidayMultiplier: string | null;
}