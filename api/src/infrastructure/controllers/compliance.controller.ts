import {
  Controller,
  Post,
  Body,
  Get,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { GenerateAlertsService } from '../../application/services/generate-alerts.service';
import { RawAlertDto } from '../../application/dto/raw-alert.dto';
import { ComplianceHealthVO } from '../../domain/value-objects/compliance-health.vo';
import { validateSync } from 'class-validator';

@Controller('compliance')
export class ComplianceController {
  constructor(private readonly genAlerts: GenerateAlertsService) {}

  @Post('alerts')
  async createAlerts(@Body() rawUpdates: RawAlertDto[]) {
    // Manual validation for array payload
    if (!Array.isArray(rawUpdates) || rawUpdates.length === 0) {
      throw new HttpException('Payload must be non-empty array', HttpStatus.BAD_REQUEST);
    }
    for (const item of rawUpdates) {
      const errors = validateSync(Object.assign(new RawAlertDto(), item));
      if (errors.length) {
        throw new HttpException(errors.map(e => e.toString()).join(', '), HttpStatus.BAD_REQUEST);
      }
    }
    const result = await this.genAlerts.generateAndScore(rawUpdates);
    return { alerts: result.alerts, health: result.health };
  }

  @Get('health')
  async health() {
    const health = await this.genAlerts.getCurrentHealth();
    return { score: health.score, counts: health.counts };
  }
}