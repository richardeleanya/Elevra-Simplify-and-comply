import {
  Controller,
  Post,
  Body,
  Get,
  Query,
  Req,
  UseGuards,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { CalculatePayslipDto } from '../../application/dto/calculate-payslip.dto';
import { GeneratePayslipDto } from '../../application/dto/generate-payslip.dto';
import { CalculatePayslipService } from '../../application/services/calculate-payslip.service';
import { GeneratePayslipService } from '../../application/services/generate-payslip.service';
import { ListPayslipsService } from '../../application/services/list-payslips.service';
import { SalaryPolicy } from '../../domain/entities/salary-policy.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Payroll')
@Controller('payrolls')
export class PayrollController {
  constructor(
    @InjectRepository(SalaryPolicy)
    private readonly salaryPolicyRepo: Repository<SalaryPolicy>,
    private readonly calculatePayslip: CalculatePayslipService,
    private readonly generatePayslip: GeneratePayslipService,
    private readonly listPayslips: ListPayslipsService,
  ) {}

  @ApiOperation({ summary: 'Calculate a payslip (dry run)' })
  @ApiResponse({ status: 201, description: 'Returns payslip calculation result' })
  @Post('calculate')
  async calculate(@Body() dto: CalculatePayslipDto) {
    const policy = await this.salaryPolicyRepo.findOne({
      where: { id: dto.salaryPolicyId },
    });
    if (!policy) {
      throw new HttpException('Salary policy not found', HttpStatus.NOT_FOUND);
    }
    const result = await this.calculatePayslip.execute(dto, policy);
    return result;
  }

  @ApiOperation({ summary: 'Generate and persist a payslip' })
  @ApiResponse({ status: 201, description: 'Returns saved payslip' })
  @Post()
  async generate(@Body() dto: GeneratePayslipDto) {
    const payslip = await this.generatePayslip.execute(dto);
    return payslip;
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'List payslips for current or specified user' })
  @ApiResponse({ status: 200, description: 'Returns list of payslips' })
  @UseGuards(JwtAuthGuard)
  @Get()
  async list(@Query('userId') userId: string, @Req() req) {
    const uid = userId || req.user?.userId;
    if (!uid) {
      throw new HttpException('Missing userId', HttpStatus.BAD_REQUEST);
    }
    const result = await this.listPayslips.execute(uid);
    return result;
  }
}