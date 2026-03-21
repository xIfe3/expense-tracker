'use client';

export function PageLoader({ message = 'Loading...' }: { message?: string }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="relative">
        <div className="h-12 w-12 rounded-full border-4 border-blue-100" />
        <div className="absolute inset-0 h-12 w-12 animate-spin rounded-full border-4 border-transparent border-t-blue-600" />
      </div>
      <p className="text-sm font-medium text-slate-500">{message}</p>
    </div>
  );
}

export function DashboardLoader() {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-4">
      <div className="relative">
        <div className="h-10 w-10 rounded-full border-4 border-blue-100" />
        <div className="absolute inset-0 h-10 w-10 animate-spin rounded-full border-4 border-transparent border-t-blue-600" />
      </div>
      <p className="text-sm text-slate-400">Loading data...</p>
    </div>
  );
}

export function Skeleton({ className = '' }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded-lg bg-slate-200/70 ${className}`}
    />
  );
}

export function CardSkeleton() {
  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
      <Skeleton className="mb-3 h-4 w-24" />
      <Skeleton className="mb-2 h-8 w-32" />
      <Skeleton className="h-3 w-20" />
    </div>
  );
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
      <div className="border-b border-slate-100 bg-slate-50/50 px-6 py-4">
        <Skeleton className="h-4 w-40" />
      </div>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 border-b border-slate-50 px-6 py-4">
          <Skeleton className="h-10 w-10 rounded-xl" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-48" />
            <Skeleton className="h-3 w-32" />
          </div>
          <Skeleton className="h-5 w-20" />
        </div>
      ))}
    </div>
  );
}

export function ChartSkeleton() {
  const heights = [50, 70, 40, 80, 60, 45, 75, 55];
  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
      <Skeleton className="mb-6 h-5 w-40" />
      <div className="flex items-end gap-2" style={{ height: '200px' }}>
        {heights.map((h, i) => (
          <div key={i} className="flex-1 rounded-t-md animate-pulse bg-slate-200/70" style={{ height: `${h}%` }} />
        ))}
      </div>
    </div>
  );
}
