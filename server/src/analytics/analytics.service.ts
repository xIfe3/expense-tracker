import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AnalyticsService {
  constructor(private prisma: PrismaService) {}

  async getDashboardSummary(userId: number, month: string) {
    const startDate = new Date(`${month}-01`);
    const endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + 1);

    // Previous month for comparison
    const prevStart = new Date(startDate);
    prevStart.setMonth(prevStart.getMonth() - 1);

    const [currentTotal, previousTotal, expenseCount, recentExpenses] =
      await Promise.all([
        this.prisma.expense.aggregate({
          where: {
            userId,
            date: { gte: startDate, lt: endDate },
          },
          _sum: { amount: true },
        }),
        this.prisma.expense.aggregate({
          where: {
            userId,
            date: { gte: prevStart, lt: startDate },
          },
          _sum: { amount: true },
        }),
        this.prisma.expense.count({
          where: {
            userId,
            date: { gte: startDate, lt: endDate },
          },
        }),
        this.prisma.expense.findMany({
          where: { userId },
          include: { category: true },
          orderBy: { date: 'desc' },
          take: 5,
        }),
      ]);

    const current = currentTotal._sum.amount || 0;
    const previous = previousTotal._sum.amount || 0;
    const changePercent =
      previous > 0 ? ((current - previous) / previous) * 100 : 0;

    return {
      totalSpent: current,
      previousMonthTotal: previous,
      changePercent: Math.round(changePercent * 10) / 10,
      expenseCount,
      recentExpenses,
    };
  }

  async getCategoryBreakdown(userId: number, month: string) {
    const startDate = new Date(`${month}-01`);
    const endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + 1);

    const expenses = await this.prisma.expense.groupBy({
      by: ['categoryId'],
      where: {
        userId,
        date: { gte: startDate, lt: endDate },
      },
      _sum: { amount: true },
      _count: true,
    });

    const categories = await this.prisma.category.findMany({
      where: {
        id: { in: expenses.map((e) => e.categoryId) },
      },
    });

    const categoryMap = new Map(categories.map((c) => [c.id, c]));
    const total = expenses.reduce((sum, e) => sum + (e._sum.amount || 0), 0);

    return expenses
      .map((e) => {
        const category = categoryMap.get(e.categoryId);
        const amount = e._sum.amount || 0;
        return {
          categoryId: e.categoryId,
          categoryName: category?.name || 'Unknown',
          color: category?.color || '#999',
          icon: category?.icon || 'tag',
          amount,
          count: e._count,
          percentage: total > 0 ? Math.round((amount / total) * 1000) / 10 : 0,
        };
      })
      .sort((a, b) => b.amount - a.amount);
  }

  async getMonthlyTrend(userId: number, months: number = 6) {
    const results = [];
    const now = new Date();

    for (let i = months - 1; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const endDate = new Date(date);
      endDate.setMonth(endDate.getMonth() + 1);

      const total = await this.prisma.expense.aggregate({
        where: {
          userId,
          date: { gte: date, lt: endDate },
        },
        _sum: { amount: true },
        _count: true,
      });

      const monthStr = date.toISOString().slice(0, 7);
      const monthLabel = date.toLocaleString('default', {
        month: 'short',
        year: 'numeric',
      });

      results.push({
        month: monthStr,
        label: monthLabel,
        total: total._sum.amount || 0,
        count: total._count || 0,
      });
    }

    return results;
  }

  async getDailySpending(userId: number, month: string) {
    const startDate = new Date(`${month}-01`);
    const endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + 1);

    const expenses = await this.prisma.expense.findMany({
      where: {
        userId,
        date: { gte: startDate, lt: endDate },
      },
      orderBy: { date: 'asc' },
    });

    // Group by day
    const dailyMap = new Map<string, number>();
    const daysInMonth = new Date(
      startDate.getFullYear(),
      startDate.getMonth() + 1,
      0,
    ).getDate();

    for (let d = 1; d <= daysInMonth; d++) {
      const dayStr = `${month}-${String(d).padStart(2, '0')}`;
      dailyMap.set(dayStr, 0);
    }

    for (const expense of expenses) {
      const dayStr = expense.date.toISOString().slice(0, 10);
      dailyMap.set(dayStr, (dailyMap.get(dayStr) || 0) + expense.amount);
    }

    return Array.from(dailyMap.entries()).map(([date, amount]) => ({
      date,
      day: parseInt(date.slice(-2)),
      amount: Math.round(amount * 100) / 100,
    }));
  }
}
