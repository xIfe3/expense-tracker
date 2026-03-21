import { AnalyticsService } from './analytics.service';
export declare class AnalyticsController {
    private analyticsService;
    constructor(analyticsService: AnalyticsService);
    getDashboardSummary(user: {
        id: number;
    }, month: string): Promise<{
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
    getCategoryBreakdown(user: {
        id: number;
    }, month: string): Promise<{
        categoryId: number;
        categoryName: string;
        color: string;
        icon: string;
        amount: number;
        count: number;
        percentage: number;
    }[]>;
    getMonthlyTrend(user: {
        id: number;
    }, months?: string): Promise<{
        month: string;
        label: string;
        total: number;
        count: number;
    }[]>;
    getDailySpending(user: {
        id: number;
    }, month: string): Promise<{
        date: string;
        day: number;
        amount: number;
    }[]>;
}
