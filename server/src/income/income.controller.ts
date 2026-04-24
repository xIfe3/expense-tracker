import { Controller, Get, Post, Body, Query, UseGuards } from '@nestjs/common';
import { IncomeService } from './income.service';
import { SetIncomeDto } from './dto/set-income.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/user.decorator';

@UseGuards(JwtAuthGuard)
@Controller('income')
export class IncomeController {
  constructor(private incomeService: IncomeService) {}

  @Get()
  get(
    @CurrentUser() user: { id: number },
    @Query('month') month: string,
  ) {
    return this.incomeService.get(user.id, month);
  }

  @Post()
  set(
    @CurrentUser() user: { id: number },
    @Body() dto: SetIncomeDto,
  ) {
    return this.incomeService.set(user.id, dto);
  }
}
