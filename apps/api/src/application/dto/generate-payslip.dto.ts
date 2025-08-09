import { IsUUID, IsDateString, IsNumberString, IsObject } from 'class-validator';

export class GeneratePayslipDto {
  @IsUUID()
  payrollId: string;

  @IsDateString()
  payDate: string;

  @IsNumberString()
  grossPay: string;

  @IsNumberString()
  netPay: string;

  @IsObject()
  breakdown: Record<string, string>;
}