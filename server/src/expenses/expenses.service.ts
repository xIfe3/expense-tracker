import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';

@Injectable()
export class ExpensesService {
  constructor(private prisma: PrismaService) {}

  async findAll(
    userId: number,
    query?: {
      categoryId?: number;
      startDate?: string;
      endDate?: string;
      search?: string;
      page?: number;
      limit?: number;
    },
  ) {
    const page = query?.page || 1;
    const limit = query?.limit || 20;
    const skip = (page - 1) * limit;

    const where: any = { userId };

    if (query?.categoryId) {
      where.categoryId = query.categoryId;
    }

    if (query?.startDate || query?.endDate) {
      where.date = {};
      if (query.startDate) where.date.gte = new Date(query.startDate);
      if (query.endDate) where.date.lte = new Date(query.endDate);
    }

    if (query?.search) {
      where.description = { contains: query.search };
    }

    const [expenses, total] = await Promise.all([
      this.prisma.expense.findMany({
        where,
        include: { category: true },
        orderBy: { date: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.expense.count({ where }),
    ]);

    return {
      data: expenses,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: number, userId: number) {
    const expense = await this.prisma.expense.findFirst({
      where: { id, userId },
      include: { category: true },
    });

    if (!expense) {
      throw new NotFoundException('Expense not found');
    }

    return expense;
  }

  async create(userId: number, dto: CreateExpenseDto) {
    return this.prisma.expense.create({
      data: {
        amount: dto.amount,
        description: dto.description,
        date: new Date(dto.date),
        categoryId: dto.categoryId,
        userId,
      },
      include: { category: true },
    });
  }

  async update(id: number, userId: number, dto: UpdateExpenseDto) {
    const expense = await this.prisma.expense.findFirst({
      where: { id, userId },
    });

    if (!expense) {
      throw new NotFoundException('Expense not found');
    }

    return this.prisma.expense.update({
      where: { id },
      data: {
        ...dto,
        date: dto.date ? new Date(dto.date) : undefined,
      },
      include: { category: true },
    });
  }

  async remove(id: number, userId: number) {
    const expense = await this.prisma.expense.findFirst({
      where: { id, userId },
    });

    if (!expense) {
      throw new NotFoundException('Expense not found');
    }

    return this.prisma.expense.delete({ where: { id } });
  }
}
