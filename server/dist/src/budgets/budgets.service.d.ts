import { PrismaService } from '../prisma/prisma.service';
import { CreateBudgetDto } from './dto/create-budget.dto';
import { UpdateBudgetDto } from './dto/update-budget.dto';
export declare class BudgetsService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(userId: number, month?: string): Promise<{
        spent: number;
        remaining: number;
        category: {
            id: number;
            name: string;
            color: string;
            icon: string;
            userId: number | null;
            createdAt: Date;
        };
        id: number;
        userId: number;
        createdAt: Date;
        amount: number;
        categoryId: number;
        month: string;
    }[]>;
    create(userId: number, dto: CreateBudgetDto): Promise<{
        category: {
            id: number;
            name: string;
            color: string;
            icon: string;
            userId: number | null;
            createdAt: Date;
        };
    } & {
        id: number;
        userId: number;
        createdAt: Date;
        amount: number;
        categoryId: number;
        month: string;
    }>;
    update(id: number, userId: number, dto: UpdateBudgetDto): Promise<{
        category: {
            id: number;
            name: string;
            color: string;
            icon: string;
            userId: number | null;
            createdAt: Date;
        };
    } & {
        id: number;
        userId: number;
        createdAt: Date;
        amount: number;
        categoryId: number;
        month: string;
    }>;
    remove(id: number, userId: number): Promise<{
        id: number;
        userId: number;
        createdAt: Date;
        amount: number;
        categoryId: number;
        month: string;
    }>;
}
