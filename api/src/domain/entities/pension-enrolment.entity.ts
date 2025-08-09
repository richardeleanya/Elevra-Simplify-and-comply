import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum PensionEnrolmentStatus {
  PENDING = 'PENDING',
  SUBMITTED = 'SUBMITTED',
  FAILED = 'FAILED',
}

@Entity('pension_enrolments')
export class PensionEnrolment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @Column({ type: 'date' })
  enrollmentDate: string;

  @Column({ type: 'enum', enum: PensionEnrolmentStatus })
  status: PensionEnrolmentStatus;

  @Column({ type: 'jsonb' })
  payload: any;

  @Column({ type: 'jsonb', nullable: true })
  response: any;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}