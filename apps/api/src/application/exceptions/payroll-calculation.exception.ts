import { InternalServerErrorException } from '@nestjs/common';

export class PayrollCalculationException extends InternalServerErrorException {
  constructor(message = 'Payroll calculation failed') {
    super(message);
  }
}