import { PrismaService } from '../prisma/prisma.service';
export declare class AnalyticsService {
    private prisma;
    constructor(prisma: PrismaService);
    getDashboardSummary(userId: number, month: string): Promise<{
        totalSpent: number;
        previousMonthTotal: number;
        changePercent: number;
        expenseCount: number;
        recentExpenses: ({
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
    }>;
    getCategoryBreakdown(userId: number, month: string): Promise<{
        categoryId: number;
        categoryName: string;
        color: string;
        icon: string;
        amount: number;
        count: number;
        percentage: number;
    }[]>;
    getMonthlyTrend(userId: number, months?: number): Promise<{
        month: string;
        label: string;
        total: number;
        count: number;
    }[]>;
    getDailySpending(userId: number, month: string): Promise<{
        date: string;
        day: number;
        amount: number;
    }[]>;
}
