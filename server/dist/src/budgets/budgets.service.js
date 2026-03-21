"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BudgetsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let BudgetsService = class BudgetsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll(userId, month) {
        const where = { userId };
        if (month)
            where.month = month;
        const budgets = await this.prisma.budget.findMany({
            where,
            include: { category: true },
            orderBy: { category: { name: 'asc' } },
        });
        const budgetsWithSpent = await Promise.all(budgets.map(async (budget) => {
            const startDate = new Date(`${budget.month}-01`);
            const endDate = new Date(startDate);
            endDate.setMonth(endDate.getMonth() + 1);
            const spent = await this.prisma.expense.aggregate({
                where: {
                    userId,
                    categoryId: budget.categoryId,
                    date: { gte: startDate, lt: endDate },
                },
                _sum: { amount: true },
            });
            return {
                ...budget,
                spent: spent._sum.amount || 0,
                remaining: budget.amount - (spent._sum.amount || 0),
            };
        }));
        return budgetsWithSpent;
    }
    async create(userId, dto) {
        return this.prisma.budget.upsert({
            where: {
                month_categoryId_userId: {
                    month: dto.month,
                    categoryId: dto.categoryId,
                    userId,
                },
            },
            update: { amount: dto.amount },
            create: {
                amount: dto.amount,
                month: dto.month,
                categoryId: dto.categoryId,
                userId,
            },
            include: { category: true },
        });
    }
    async update(id, userId, dto) {
        const budget = await this.prisma.budget.findFirst({
            where: { id, userId },
        });
        if (!budget) {
            throw new common_1.NotFoundException('Budget not found');
        }
        return this.prisma.budget.update({
            where: { id },
            data: dto,
            include: { category: true },
        });
    }
    async remove(id, userId) {
        const budget = await this.prisma.budget.findFirst({
            where: { id, userId },
        });
        if (!budget) {
            throw new common_1.NotFoundException('Budget not found');
        }
        return this.prisma.budget.delete({ where: { id } });
    }
};
exports.BudgetsService = BudgetsService;
exports.BudgetsService = BudgetsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], BudgetsService);
//# sourceMappingURL=budgets.service.js.map