import { IsUUID, IsDateString, IsNumber, Min, IsOptional } from 'class-validator';

export class CalculatePayslipDto {
  @IsUUID()
  userId: string;

  @IsUUID()
  salaryPolicyId: string;

  @IsDateString()
  periodStart: string;

  @IsDateString()
  periodEnd: string;

  @IsNumber()
  @Min(0)
  regularHours: number;

  @IsNumber()
  @Min(0)
  nightHours: number;

  @IsNumber()
  @Min(0)
  weekendHours: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  bankHolidayHours?: number;
}