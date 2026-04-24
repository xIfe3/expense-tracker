'use client';

import { useState, useEffect } from 'react';
import { analytics as analyticsApi, income as incomeApi } from '@/lib/api';
import { formatCurrency, getCurrentMonth, getMonthLabel, formatDate } from '@/lib/utils';
import { CardSkeleton, ChartSkeleton } from '@/components/loading';
import {
  TrendingUp,
  TrendingDown,
  Receipt,
  ArrowUpRight,
  ArrowDownRight,
  Pencil,
  Check,
  X,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from 'recharts';

interface Summary {
  totalSpent: number;
  previousMonthTotal: number;
  changePercent: number;
  expenseCount: number;
  monthlyIncome: number | null;
  remaining: number | null;
  recentExpenses: Array<{
    id: number;
    amount: number;
    description: string;
    date: string;
    category: { name: string; color: string };
  }>;
}

interface CategoryBreakdown {
  categoryName: string;
  color: string;
  amount: number;
  percentage: number;
}

interface TrendData {
  label: string;
  total: number;
}

interface DailyData {
  day: number;
  amount: number;
}

const tooltipStyle = {
  contentStyle: {
    background: '#0f172a',
    border: 'none',
    borderRadius: '12px',
    color: '#fff',
    fontSize: '12px',
    padding: '8px 12px',
  },
  labelStyle: { color: '#94a3b8' },
  itemStyle: { color: '#fff' },
};

export default function DashboardPage() {
  const [month] = useState(getCurrentMonth());
  const [summary, setSummary] = useState<Summary | null>(null);
  const [categoryData, setCategoryData] = useState<CategoryBreakdown[]>([]);
  const [trendData, setTrendData] = useState<TrendData[]>([]);
  const [dailyData, setDailyData] = useState<DailyData[]>([]);
  const [loading, setLoading] = useState(true);

  const [editingIncome, setEditingIncome] = useState(false);
  const [incomeInput, setIncomeInput] = useState('');
  const [savingIncome, setSavingIncome] = useState(false);

  useEffect(() => {
    Promise.all([
      analyticsApi.summary(month),
      analyticsApi.categories(month),
      analyticsApi.trend(6),
      analyticsApi.daily(month),
    ])
      .then(([sum, cats, trend, daily]) => {
        setSummary(sum);
        setCategoryData(cats);
        setTrendData(trend);
        setDailyData(daily);
      })
      .finally(() => setLoading(false));
  }, [month]);

  const handleSaveIncome = async () => {
    const amount = parseFloat(incomeInput);
    if (isNaN(amount) || amount < 0) return;
    setSavingIncome(true);
    try {
      await incomeApi.set({ month, amount });
      setSummary((prev) =>
        prev
          ? { ...prev, monthlyIncome: amount, remaining: amount - prev.totalSpent }
          : prev,
      );
      setEditingIncome(false);
    } finally {
      setSavingIncome(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <div className="h-8 w-48 animate-pulse rounded-lg bg-slate-200" />
          <div className="mt-2 h-4 w-32 animate-pulse rounded bg-slate-100" />
        </div>
        <div className="h-20 animate-pulse rounded-2xl bg-slate-100" />
        <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
          <div className="flex-1"><CardSkeleton /></div>
          <div className="flex-1"><CardSkeleton /></div>
          <div className="flex-1 sm:max-w-[200px]"><CardSkeleton /></div>
        </div>
        <div className="flex flex-col gap-4 lg:flex-row lg:gap-6">
          <div className="flex-[2]"><ChartSkeleton /></div>
          <div className="flex-1"><ChartSkeleton /></div>
        </div>
        <ChartSkeleton />
      </div>
    );
  }

  const isUp = (summary?.changePercent || 0) > 0;
  const hasIncome = summary?.monthlyIncome != null;
  const spentPercent = hasIncome
    ? Math.min(100, Math.round(((summary!.totalSpent) / summary!.monthlyIncome!) * 100))
    : 0;
  const isOverBudget = hasIncome && summary!.totalSpent > summary!.monthlyIncome!;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
        <p className="mt-1 text-sm text-slate-500">{getMonthLabel(month)} overview</p>
      </div>

      {/* Salary / remaining banner */}
      <div className="rounded-2xl border border-slate-100 bg-white p-4 sm:p-5">
        {hasIncome && !editingIncome ? (
          <div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6">
                <div>
                  <p className="text-xs text-slate-400">Monthly salary</p>
                  <p className="mt-0.5 text-lg font-bold text-slate-900">
                    {formatCurrency(summary!.monthlyIncome!)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-400">Spent</p>
                  <p className="mt-0.5 text-lg font-bold text-slate-900">
                    {formatCurrency(summary!.totalSpent)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-400">Remaining</p>
                  <p className={`mt-0.5 text-lg font-bold ${isOverBudget ? 'text-red-500' : 'text-emerald-600'}`}>
                    {formatCurrency(Math.abs(summary!.remaining!))}
                    {isOverBudget && <span className="ml-1 text-xs font-medium">over</span>}
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setIncomeInput(String(summary!.monthlyIncome));
                  setEditingIncome(true);
                }}
                className="rounded-lg p-2 text-slate-400 hover:bg-slate-50 hover:text-slate-600"
              >
                <Pencil className="h-4 w-4" />
              </button>
            </div>
            <div className="mt-3">
              <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                <div
                  className={`h-2 rounded-full transition-all ${isOverBudget ? 'bg-red-500' : spentPercent > 80 ? 'bg-amber-400' : 'bg-emerald-500'}`}
                  style={{ width: `${spentPercent}%` }}
                />
              </div>
              <p className="mt-1.5 text-xs text-slate-400">{spentPercent}% of salary spent</p>
            </div>
          </div>
        ) : editingIncome ? (
          <div className="flex items-center gap-3">
            <div className="flex-1">
              <label className="mb-1 block text-xs text-slate-500">
                Monthly salary for {getMonthLabel(month)}
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={incomeInput}
                onChange={(e) => setIncomeInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSaveIncome()}
                autoFocus
                className="w-full max-w-[200px] rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                placeholder="e.g. 1800"
              />
            </div>
            <div className="flex gap-2 pt-5">
              <button
                onClick={handleSaveIncome}
                disabled={savingIncome}
                className="flex items-center gap-1.5 rounded-md bg-slate-900 px-3 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-60"
              >
                <Check className="h-3.5 w-3.5" />
                Save
              </button>
              <button
                onClick={() => setEditingIncome(false)}
                className="rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-600 hover:bg-slate-50"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-700">No salary set for this month</p>
              <p className="text-xs text-slate-400">Add your monthly income to track how much you have left.</p>
            </div>
            <button
              onClick={() => {
                setIncomeInput('');
                setEditingIncome(true);
              }}
              className="rounded-md border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Set salary
            </button>
          </div>
        )}
      </div>

      {/* Top stats — asymmetric */}
      <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
        {/* Big stat */}
        <div className="flex-1 rounded-2xl bg-slate-900 p-5 sm:p-6 text-white">
          <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
            Total spent
          </p>
          <p className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
            {formatCurrency(summary?.totalSpent || 0)}
          </p>
          <div className="mt-3 flex items-center gap-1.5 text-sm">
            {isUp ? (
              <ArrowUpRight className="h-4 w-4 text-red-400" />
            ) : (
              <ArrowDownRight className="h-4 w-4 text-emerald-400" />
            )}
            <span className={isUp ? 'text-red-400' : 'text-emerald-400'}>
              {Math.abs(summary?.changePercent || 0)}%
            </span>
            <span className="text-slate-500">vs last month</span>
          </div>
        </div>

        {/* Medium stat */}
        <div className="flex-1 rounded-2xl border border-slate-100 bg-white p-5 sm:p-6">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
              Last month
            </p>
            {isUp ? (
              <TrendingUp className="h-4 w-4 text-red-400" />
            ) : (
              <TrendingDown className="h-4 w-4 text-emerald-500" />
            )}
          </div>
          <p className="mt-2 text-xl font-bold text-slate-900 sm:text-2xl">
            {formatCurrency(summary?.previousMonthTotal || 0)}
          </p>
          <p className="mt-1 text-xs text-slate-400">Previous period total</p>
        </div>

        {/* Small stat */}
        <div className="flex-1 rounded-2xl border border-slate-100 bg-white p-5 sm:max-w-[200px] sm:p-6">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
              Transactions
            </p>
            <Receipt className="h-4 w-4 text-slate-400" />
          </div>
          <p className="mt-2 text-xl font-bold text-slate-900 sm:text-2xl">
            {summary?.expenseCount || 0}
          </p>
          <p className="mt-1 text-xs text-slate-400">This month</p>
        </div>
      </div>

      {/* Charts — asymmetric 2:1 */}
      <div className="flex flex-col gap-4 lg:flex-row lg:gap-6">
        {/* Daily spending — wide */}
        <div className="flex-[2] rounded-2xl border border-slate-100 bg-white p-4 sm:p-6">
          <h2 className="mb-1 text-sm font-semibold text-slate-900">Daily spending</h2>
          <p className="mb-6 text-xs text-slate-400">How your spending flows through the month</p>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={dailyData}>
              <defs>
                <linearGradient id="areaFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.15} />
                  <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="day" fontSize={11} tickLine={false} axisLine={false} tick={{ fill: '#94a3b8' }} />
              <YAxis fontSize={11} tickLine={false} axisLine={false} tick={{ fill: '#94a3b8' }} width={45} />
              <Tooltip {...tooltipStyle} formatter={(value: number) => [formatCurrency(value), 'Spent']} />
              <Area type="monotone" dataKey="amount" stroke="#3b82f6" strokeWidth={2} fill="url(#areaFill)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Category pie — narrow */}
        <div className="flex-1 rounded-2xl border border-slate-100 bg-white p-4 sm:p-6">
          <h2 className="mb-1 text-sm font-semibold text-slate-900">By category</h2>
          <p className="mb-4 text-xs text-slate-400">Where the money goes</p>
          {categoryData.length > 0 ? (
            <>
              <ResponsiveContainer width="100%" height={160}>
                <PieChart>
                  <Pie data={categoryData} dataKey="amount" nameKey="categoryName" cx="50%" cy="50%" outerRadius={70} innerRadius={45} strokeWidth={0}>
                    {categoryData.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip {...tooltipStyle} formatter={(value: number) => formatCurrency(value)} />
                </PieChart>
              </ResponsiveContainer>
              <div className="mt-2 space-y-2">
                {categoryData.slice(0, 4).map((cat) => (
                  <div key={cat.categoryName} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full" style={{ backgroundColor: cat.color }} />
                      <span className="text-slate-600">{cat.categoryName}</span>
                    </div>
                    <span className="font-medium text-slate-900">{cat.percentage}%</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="flex h-[220px] items-center justify-center text-sm text-slate-400">
              No data yet
            </div>
          )}
        </div>
      </div>

      {/* Bottom row — asymmetric 1:2 */}
      <div className="flex flex-col gap-4 lg:flex-row lg:gap-6">
        {/* Monthly trend */}
        <div className="flex-1 rounded-2xl border border-slate-100 bg-white p-4 sm:p-6">
          <h2 className="mb-1 text-sm font-semibold text-slate-900">Monthly trend</h2>
          <p className="mb-6 text-xs text-slate-400">Last 6 months</p>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={trendData}>
              <XAxis dataKey="label" fontSize={11} tickLine={false} axisLine={false} tick={{ fill: '#94a3b8' }} />
              <YAxis fontSize={11} tickLine={false} axisLine={false} tick={{ fill: '#94a3b8' }} width={45} />
              <Tooltip {...tooltipStyle} formatter={(value: number) => [formatCurrency(value), 'Total']} />
              <Bar dataKey="total" fill="#0f172a" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Recent expenses */}
        <div className="flex-[1.2] rounded-2xl border border-slate-100 bg-white p-4 sm:p-6">
          <h2 className="mb-1 text-sm font-semibold text-slate-900">Recent expenses</h2>
          <p className="mb-4 text-xs text-slate-400">Your latest transactions</p>
          {summary?.recentExpenses && summary.recentExpenses.length > 0 ? (
            <div className="space-y-1">
              {summary.recentExpenses.map((expense) => (
                <div key={expense.id} className="flex items-center justify-between rounded-xl px-3 py-3 transition-colors hover:bg-slate-50">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-lg" style={{ backgroundColor: expense.category.color + '15' }}>
                      <div className="flex h-full w-full items-center justify-center">
                        <div className="h-2 w-2 rounded-full" style={{ backgroundColor: expense.category.color }} />
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-900">{expense.description}</p>
                      <p className="text-xs text-slate-400">
                        {expense.category.name} &middot; {formatDate(expense.date)}
                      </p>
                    </div>
                  </div>
                  <span className="text-sm font-semibold text-slate-900">
                    {formatCurrency(expense.amount)}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex h-[200px] items-center justify-center text-sm text-slate-400">
              No expenses yet
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
