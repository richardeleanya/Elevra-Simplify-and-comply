import { IsUUID, IsDateString, IsObject } from 'class-validator';

export class PensionEnrolmentDto {
  @IsUUID()
  userId: string;

  @IsDateString()
  enrollmentDate: string;

  @IsObject()
  payload: object;
}