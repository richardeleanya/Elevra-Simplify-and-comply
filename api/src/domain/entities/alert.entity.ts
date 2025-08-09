import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

export enum AlertType {
  REGULATION_UPDATE = 'REGULATION_UPDATE',
  INCIDENT_REPORT = 'INCIDENT_REPORT',
}

export enum Severity {
  INFO = 'INFO',
  WARNING = 'WARNING',
  CRITICAL = 'CRITICAL',
}

@Entity('alerts')
export class Alert {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'enum', enum: AlertType })
  type: AlertType;

  @Column()
  message: string;

  @Column({ type: 'enum', enum: Severity })
  severity: Severity;

  @CreateDateColumn()
  createdAt: Date;
}