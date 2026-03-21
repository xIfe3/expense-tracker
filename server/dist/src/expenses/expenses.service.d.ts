import { PrismaService } from '../prisma/prisma.service';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
export declare class ExpensesService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(userId: number, query?: {
        categoryId?: number;
        startDate?: string;
        endDate?: string;
        search?: string;
        page?: number;
        limit?: number;
    }): Promise<{
        data: ({
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
            description: string;
            date: Date;
            categoryId: number;
            updatedAt: Date;
        })[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    findOne(id: number, userId: number): Promise<{
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
        description: string;
        date: Date;
        categoryId: number;
        updatedAt: Date;
    }>;
    create(userId: number, dto: CreateExpenseDto): Promise<{
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
        description: string;
        date: Date;
        categoryId: number;
        updatedAt: Date;
    }>;
    update(id: number, userId: number, dto: UpdateExpenseDto): Promise<{
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
        description: string;
        date: Date;
        categoryId: number;
        updatedAt: Date;
    }>;
    remove(id: number, userId: number): Promise<{
        id: number;
        userId: number;
        createdAt: Date;
        amount: number;
        description: string;
        date: Date;
        categoryId: number;
        updatedAt: Date;
    }>;
}
