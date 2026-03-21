import { ExpensesService } from './expenses.service';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
export declare class ExpensesController {
    private expensesService;
    constructor(expensesService: ExpensesService);
    findAll(user: {
        id: number;
    }, categoryId?: string, startDate?: string, endDate?: string, search?: string, page?: string, limit?: string): Promise<{
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
    findOne(user: {
        id: number;
    }, id: number): Promise<{
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
    create(user: {
        id: number;
    }, dto: CreateExpenseDto): Promise<{
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
    update(user: {
        id: number;
    }, id: number, dto: UpdateExpenseDto): Promise<{
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
    remove(user: {
        id: number;
    }, id: number): Promise<{
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
