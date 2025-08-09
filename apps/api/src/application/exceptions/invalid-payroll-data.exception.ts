import { BadRequestException } from '@nestjs/common';

export class InvalidPayrollDataException extends BadRequestException {
  constructor(message = 'Invalid payroll data provided') {
    super(message);
  }
}