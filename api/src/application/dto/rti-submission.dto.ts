import { IsUUID, IsDateString, IsObject } from 'class-validator';

export class RtiSubmissionDto {
  @IsUUID()
  payrollId: string;

  @IsDateString()
  submissionDate: string;

  @IsObject()
  payload: object;
}