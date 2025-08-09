import { IsString, IsEnum, IsOptional, IsDateString } from 'class-validator';
import { AlertType, Severity } from '../../domain/entities/alert.entity';

export class RawAlertDto {
  @IsString()
  source: string;

  @IsString()
  content: string;

  @IsDateString()
  date: string;

  @IsEnum(AlertType)
  type: AlertType;

  @IsEnum(Severity)
  severity: Severity;

  @IsOptional()
  @IsString()
  message?: string;
}