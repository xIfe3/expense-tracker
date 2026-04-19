const API_URL = "https://expense-tracker-depy.onrender.com";

async function fetchApi(endpoint: string, options: RequestInit = {}) {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const res = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  if (res.status === 401) {
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    throw new Error("Unauthorized");
  }

  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: "Request failed" }));
    throw new Error(error.message || "Request failed");
  }

  return res.json();
}

// Auth
export const auth = {
  register: (data: { name: string; email: string; password: string }) =>
    fetchApi("/auth/register", { method: "POST", body: JSON.stringify(data) }),
  login: (data: { email: string; password: string }) =>
    fetchApi("/auth/login", { method: "POST", body: JSON.stringify(data) }),
  profile: () => fetchApi("/auth/profile"),
};

// Categories
export const categories = {
  list: () => fetchApi("/categories"),
  create: (data: { name: string; color: string; icon?: string }) =>
    fetchApi("/categories", { method: "POST", body: JSON.stringify(data) }),
  update: (
    id: number,
    data: { name?: string; color?: string; icon?: string },
  ) =>
    fetchApi(`/categories/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),
  delete: (id: number) => fetchApi(`/categories/${id}`, { method: "DELETE" }),
};

// Expenses
export const expenses = {
  list: (params?: Record<string, string>) => {
    const query = params ? "?" + new URLSearchParams(params).toString() : "";
    return fetchApi(`/expenses${query}`);
  },
  get: (id: number) => fetchApi(`/expenses/${id}`),
  create: (data: {
    amount: number;
    description: string;
    date: string;
    categoryId: number;
  }) => fetchApi("/expenses", { method: "POST", body: JSON.stringify(data) }),
  update: (id: number, data: Record<string, unknown>) =>
    fetchApi(`/expenses/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),
  delete: (id: number) => fetchApi(`/expenses/${id}`, { method: "DELETE" }),
};

// Budgets
export const budgets = {
  list: (month?: string) => {
    const query = month ? `?month=${month}` : "";
    return fetchApi(`/budgets${query}`);
  },
  create: (data: { amount: number; month: string; categoryId: number }) =>
    fetchApi("/budgets", { method: "POST", body: JSON.stringify(data) }),
  update: (id: number, data: { amount?: number }) =>
    fetchApi(`/budgets/${id}`, { method: "PATCH", body: JSON.stringify(data) }),
  delete: (id: number) => fetchApi(`/budgets/${id}`, { method: "DELETE" }),
};

// Analytics
export const analytics = {
  summary: (month: string) => fetchApi(`/analytics/summary?month=${month}`),
  categories: (month: string) =>
    fetchApi(`/analytics/categories?month=${month}`),
  trend: (months?: number) =>
    fetchApi(`/analytics/trend${months ? `?months=${months}` : ""}`),
  daily: (month: string) => fetchApi(`/analytics/daily?month=${month}`),
};
