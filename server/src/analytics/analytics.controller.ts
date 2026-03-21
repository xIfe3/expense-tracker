import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/user.decorator';

@UseGuards(JwtAuthGuard)
@Controller('analytics')
export class AnalyticsController {
  constructor(private analyticsService: AnalyticsService) {}

  @Get('summary')
  getDashboardSummary(
    @CurrentUser() user: { id: number },
    @Query('month') month: string,
  ) {
    return this.analyticsService.getDashboardSummary(user.id, month);
  }

  @Get('categories')
  getCategoryBreakdown(
    @CurrentUser() user: { id: number },
    @Query('month') month: string,
  ) {
    return this.analyticsService.getCategoryBreakdown(user.id, month);
  }

  @Get('trend')
  getMonthlyTrend(
    @CurrentUser() user: { id: number },
    @Query('months') months?: string,
  ) {
    return this.analyticsService.getMonthlyTrend(
      user.id,
      months ? +months : 6,
    );
  }

  @Get('daily')
  getDailySpending(
    @CurrentUser() user: { id: number },
    @Query('month') month: string,
  ) {
    return this.analyticsService.getDailySpending(user.id, month);
  }
}
