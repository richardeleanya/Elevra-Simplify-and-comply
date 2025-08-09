import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum RtiSubmissionStatus {
  PENDING = 'PENDING',
  SUBMITTED = 'SUBMITTED',
  FAILED = 'FAILED',
}

@Entity('rti_submissions')
export class RtiSubmission {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  payrollId: string;

  @Column({ type: 'date' })
  submissionDate: string;

  @Column({ type: 'enum', enum: RtiSubmissionStatus })
  status: RtiSubmissionStatus;

  @Column({ type: 'jsonb' })
  payload: any;

  @Column({ type: 'jsonb', nullable: true })
  response: any;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}