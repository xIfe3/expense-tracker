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
exports.ExpensesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let ExpensesService = class ExpensesService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll(userId, query) {
        const page = query?.page || 1;
        const limit = query?.limit || 20;
        const skip = (page - 1) * limit;
        const where = { userId };
        if (query?.categoryId) {
            where.categoryId = query.categoryId;
        }
        if (query?.startDate || query?.endDate) {
            where.date = {};
            if (query.startDate)
                where.date.gte = new Date(query.startDate);
            if (query.endDate)
                where.date.lte = new Date(query.endDate);
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
    async findOne(id, userId) {
        const expense = await this.prisma.expense.findFirst({
            where: { id, userId },
            include: { category: true },
        });
        if (!expense) {
            throw new common_1.NotFoundException('Expense not found');
        }
        return expense;
    }
    async create(userId, dto) {
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
    async update(id, userId, dto) {
        const expense = await this.prisma.expense.findFirst({
            where: { id, userId },
        });
        if (!expense) {
            throw new common_1.NotFoundException('Expense not found');
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
    async remove(id, userId) {
        const expense = await this.prisma.expense.findFirst({
            where: { id, userId },
        });
        if (!expense) {
            throw new common_1.NotFoundException('Expense not found');
        }
        return this.prisma.expense.delete({ where: { id } });
    }
};
exports.ExpensesService = ExpensesService;
exports.ExpensesService = ExpensesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ExpensesService);
//# sourceMappingURL=expenses.service.js.map