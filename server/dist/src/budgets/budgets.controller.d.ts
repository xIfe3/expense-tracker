import { BudgetsService } from './budgets.service';
import { CreateBudgetDto } from './dto/create-budget.dto';
import { UpdateBudgetDto } from './dto/update-budget.dto';
export declare class BudgetsController {
    private budgetsService;
    constructor(budgetsService: BudgetsService);
    findAll(user: {
        id: number;
    }, month?: string): Promise<{
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
    create(user: {
        id: number;
    }, dto: CreateBudgetDto): Promise<{
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
    update(user: {
        id: number;
    }, id: number, dto: UpdateBudgetDto): Promise<{
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
    remove(user: {
        id: number;
    }, id: number): Promise<{
        id: number;
        userId: number;
        createdAt: Date;
        amount: number;
        categoryId: number;
        month: string;
    }>;
}
