import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SetIncomeDto } from './dto/set-income.dto';

@Injectable()
export class IncomeService {
  constructor(private prisma: PrismaService) {}

  async get(userId: number, month: string) {
    return this.prisma.monthlyIncome.findUnique({
      where: { month_userId: { month, userId } },
    });
  }

  async set(userId: number, dto: SetIncomeDto) {
    return this.prisma.monthlyIncome.upsert({
      where: { month_userId: { month: dto.month, userId } },
      update: { amount: dto.amount },
      create: { amount: dto.amount, month: dto.month, userId },
    });
  }
}
