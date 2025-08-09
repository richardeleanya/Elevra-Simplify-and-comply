import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Alert, Severity } from '../../domain/entities/alert.entity';
import { RawAlertDto } from '../dto/raw-alert.dto';
import { ComplianceHealthVO } from '../../domain/value-objects/compliance-health.vo';
import { Counter, InjectMetric } from '@willsoto/nestjs-prometheus';

@Injectable()
export class GenerateAlertsService {
  constructor(
    @InjectRepository(Alert)
    private readonly alertRepo: Repository<Alert>,
    @InjectMetric('alerts_generated_total')
    private readonly alertsGenerated: Counter<string>
  ) {}

  async generateAndScore(rawUpdates: RawAlertDto[]): Promise<{ alerts: Alert[]; health: ComplianceHealthVO }> {
    const toSave: Alert[] = rawUpdates.map(u => {
      const alert = this.alertRepo.create({
        type: u.type,
        message: u.message || u.content,
        severity: u.severity,
      });
      return alert;
    });
    const saved = await this.alertRepo.save(toSave);

    // Prometheus: count generated alerts
    this.alertsGenerated.inc(toSave.length);

    // Recalculate compliance health
    const allAlerts = await this.alertRepo.find();
    const counts: Record<Severity, number> = {
      [Severity.INFO]: 0,
      [Severity.WARNING]: 0,
      [Severity.CRITICAL]: 0,
    };
    for (const a of allAlerts) {
      counts[a.severity]++;
    }
    const health = new ComplianceHealthVO(counts);
    return { alerts: saved, health };
  }

  async getCurrentHealth(): Promise<ComplianceHealthVO> {
    const all = await this.alertRepo.find();
    const counts: Record<Severity, number> = {
      [Severity.INFO]: 0,
      [Severity.WARNING]: 0,
      [Severity.CRITICAL]: 0,
    };
    for (const a of all) {
      counts[a.severity]++;
    }
    return new ComplianceHealthVO(counts);
  }
}