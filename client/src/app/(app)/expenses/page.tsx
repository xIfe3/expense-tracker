'use client';

import { useState, useEffect, useCallback } from 'react';
import { expenses as expensesApi, categories as categoriesApi } from '@/lib/api';
import { formatCurrency, formatDate, getCurrentMonth } from '@/lib/utils';
import { useToast } from '@/components/toast';
import { ConfirmModal } from '@/components/confirm-modal';
import { TableSkeleton } from '@/components/loading';
import { Plus, Trash2, Pencil, Search, X } from 'lucide-react';

interface Category { id: number; name: string; color: string; }
interface Expense {
  id: number; amount: number; description: string; date: string;
  category: Category;
}
interface ExpenseForm {
  amount: string; description: string; date: string; categoryId: string;
}

const emptyForm: ExpenseForm = {
  amount: '', description: '',
  date: new Date().toISOString().slice(0, 10), categoryId: '',
};

export default function ExpensesPage() {
  const { toast } = useToast();
  const [expensesList, setExpensesList] = useState<Expense[]>([]);
  const [categoriesList, setCategoriesList] = useState<Category[]>([]);
  const [meta, setMeta] = useState({ total: 0, page: 1, totalPages: 1 });
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState<ExpenseForm>(emptyForm);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchExpenses = useCallback(async (page = 1) => {
    const params: Record<string, string> = { page: String(page), limit: '15' };
    if (search) params.search = search;
    if (categoryFilter) params.categoryId = categoryFilter;
    const month = getCurrentMonth();
    params.startDate = `${month}-01`;
    const end = new Date(parseInt(month.split('-')[0]), parseInt(month.split('-')[1]), 0);
    params.endDate = end.toISOString().slice(0, 10);
    const res = await expensesApi.list(params);
    setExpensesList(res.data);
    setMeta(res.meta);
  }, [search, categoryFilter]);

  useEffect(() => {
    Promise.all([fetchExpenses(), categoriesApi.list()]).then(([, cats]) => {
      setCategoriesList(cats);
      setLoading(false);
    });
  }, [fetchExpenses]);

  const openAdd = () => { setEditId(null); setForm(emptyForm); setShowModal(true); };
  const openEdit = (expense: Expense) => {
    setEditId(expense.id);
    setForm({
      amount: String(expense.amount), description: expense.description,
      date: new Date(expense.date).toISOString().slice(0, 10),
      categoryId: String(expense.category.id),
    });
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const data = {
        amount: parseFloat(form.amount), description: form.description,
        date: form.date, categoryId: parseInt(form.categoryId),
      };
      if (editId) {
        await expensesApi.update(editId, data);
        toast('Expense updated', 'success');
      } else {
        await expensesApi.create(data);
        toast('Expense added', 'success');
      }
      setShowModal(false);
      fetchExpenses(meta.page);
    } catch (err: unknown) {
      toast(err instanceof Error ? err.message : 'Failed to save', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await expensesApi.delete(deleteTarget);
      toast('Expense deleted', 'success');
      fetchExpenses(meta.page);
    } catch {
      toast('Failed to delete', 'error');
    } finally {
      setDeleting(false);
      setDeleteTarget(null);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="h-8 w-32 animate-pulse rounded-lg bg-slate-200" />
          <div className="h-10 w-36 animate-pulse rounded-xl bg-slate-200" />
        </div>
        <TableSkeleton rows={6} />
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900 sm:text-2xl">Expenses</h1>
          <p className="mt-0.5 text-sm text-slate-500">{meta.total} transactions this month</p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-slate-800"
        >
          <Plus className="h-4 w-4" /> Add expense
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search expenses..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-slate-200 py-2.5 pl-10 pr-4 text-sm outline-none placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
          />
        </div>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-700 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
        >
          <option value="">All categories</option>
          {categoriesList.map((cat) => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>
      </div>

      {/* List */}
      <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white">
        {expensesList.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-sm text-slate-400">No expenses found</p>
            <button onClick={openAdd} className="mt-3 text-sm font-semibold text-blue-600 hover:text-blue-700">
              Add your first expense
            </button>
          </div>
        ) : (
          <div className="divide-y divide-slate-50">
            {expensesList.map((expense) => (
              <div key={expense.id} className="flex items-center justify-between px-4 py-3.5 transition-colors hover:bg-slate-50/50 sm:px-6 sm:py-4">
                <div className="flex min-w-0 flex-1 items-center gap-3 sm:gap-4">
                  <div
                    className="hidden h-10 w-10 shrink-0 items-center justify-center rounded-xl sm:flex"
                    style={{ backgroundColor: expense.category.color + '12' }}
                  >
                    <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: expense.category.color }} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-slate-900">{expense.description}</p>
                    <div className="mt-0.5 flex items-center gap-2 text-xs text-slate-400">
                      <span
                        className="inline-block h-1.5 w-1.5 rounded-full sm:hidden"
                        style={{ backgroundColor: expense.category.color }}
                      />
                      <span className="truncate">{expense.category.name}</span>
                      <span className="hidden sm:inline">&middot;</span>
                      <span className="hidden sm:inline">{formatDate(expense.date)}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 sm:gap-4">
                  <span className="text-sm font-semibold text-slate-900 whitespace-nowrap">
                    {formatCurrency(expense.amount)}
                  </span>
                  <div className="flex gap-0.5">
                    <button onClick={() => openEdit(expense)} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-blue-600">
                      <Pencil className="h-3.5 w-3.5" />
                    </button>
                    <button onClick={() => setDeleteTarget(expense.id)} className="rounded-lg p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600">
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Pagination */}
      {meta.totalPages > 1 && (
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-400">Page {meta.page} of {meta.totalPages}</span>
          <div className="flex gap-2">
            <button onClick={() => fetchExpenses(meta.page - 1)} disabled={meta.page <= 1} className="rounded-lg border border-slate-200 px-3 py-1.5 text-slate-600 hover:bg-slate-50 disabled:opacity-40">Prev</button>
            <button onClick={() => fetchExpenses(meta.page + 1)} disabled={meta.page >= meta.totalPages} className="rounded-lg border border-slate-200 px-3 py-1.5 text-slate-600 hover:bg-slate-50 disabled:opacity-40">Next</button>
          </div>
        </div>
      )}

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center bg-slate-950/50 backdrop-blur-sm">
          <div className="animate-scale-in w-full max-w-md rounded-t-2xl sm:rounded-2xl bg-white p-5 sm:p-6 shadow-2xl mx-0 sm:mx-4">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900">{editId ? 'Edit expense' : 'New expense'}</h2>
              <button onClick={() => setShowModal(false)} className="rounded-lg p-1 text-slate-400 hover:bg-slate-100">
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex gap-3">
                <div className="flex-1">
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500">Amount</label>
                  <input type="number" step="0.01" min="0" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} required className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10" placeholder="0.00" />
                </div>
                <div className="flex-1">
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500">Date</label>
                  <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} required className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10" />
                </div>
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500">Description</label>
                <input type="text" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10" placeholder="What did you spend on?" />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500">Category</label>
                <select value={form.categoryId} onChange={(e) => setForm({ ...form, categoryId: e.target.value })} required className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10">
                  <option value="">Select category</option>
                  {categoriesList.map((cat) => (<option key={cat.id} value={cat.id}>{cat.name}</option>))}
                </select>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 rounded-xl border border-slate-200 py-3 text-sm font-medium text-slate-600 hover:bg-slate-50">Cancel</button>
                <button type="submit" disabled={submitting} className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-slate-900 py-3 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-50">
                  {submitting ? <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/20 border-t-white" /> : editId ? 'Update' : 'Add expense'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete confirmation */}
      <ConfirmModal
        open={deleteTarget !== null}
        title="Delete expense"
        message="This expense will be permanently removed. This action cannot be undone."
        confirmText="Delete"
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
