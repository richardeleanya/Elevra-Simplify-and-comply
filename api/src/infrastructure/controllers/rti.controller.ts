import { Controller, Post, Get, Param, Body, HttpException, HttpStatus } from '@nestjs/common';
import { RtiSubmissionService } from '../../application/services/rti-submission.service';
import { RtiSubmissionDto } from '../../application/dto/rti-submission.dto';

@Controller('rti')
export class RtiController {
  constructor(private readonly rtiService: RtiSubmissionService) {}

  @Post('submit')
  async submit(@Body() dto: RtiSubmissionDto) {
    try {
      return await this.rtiService.submit(dto);
    } catch (err) {
      throw new HttpException('RTI submission failed', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get(':payrollId')
  async list(@Param('payrollId') payrollId: string) {
    return this.rtiService.findByPayroll(payrollId);
  }
}