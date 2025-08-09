import { Controller, Post, Get, Param, Body, HttpException, HttpStatus } from '@nestjs/common';
import { PensionEnrolmentService } from '../../application/services/pension-enrolment.service';
import { PensionEnrolmentDto } from '../../application/dto/pension-enrolment.dto';

@Controller('pensions')
export class PensionController {
  constructor(private readonly pensionService: PensionEnrolmentService) {}

  @Post('enroll')
  async enroll(@Body() dto: PensionEnrolmentDto) {
    try {
      return await this.pensionService.enroll(dto);
    } catch (err) {
      throw new HttpException('Pension enrollment failed', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get(':userId')
  async list(@Param('userId') userId: string) {
    return this.pensionService.findByUser(userId);
  }
}