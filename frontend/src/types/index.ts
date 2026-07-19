export type Role = "ADMIN" | "USER";

export interface UserSummary {
  id: string;
  name: string;
}

export interface User {
  id: string;
  login: string;
  name: string;
  role: Role;
  active: boolean;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string | null;
  color: string | null;
  isDefault: boolean;
  subcategories: Subcategory[];
}

export interface Subcategory {
  id: string;
  name: string;
  categoryId: string;
}

export interface Expense {
  id: string;
  label: string | null;
  amount: number;
  date: string;
  categoryId: string;
  category?: Category;
  subcategoryId: string | null;
  subcategory?: Subcategory | null;
  createdBy: UserSummary;
}

export interface Income {
  id: string;
  label: string;
  amount: number;
  date: string;
  createdBy: UserSummary;
}

export interface ExpenseTemplate {
  id: string;
  label: string;
  amount: number;
  dayOfMonth: number;
  startDate: string;
  endDate: string | null;
  active: boolean;
  categoryId: string;
  category?: Category;
  subcategoryId: string | null;
  subcategory?: Subcategory | null;
  createdBy: UserSummary;
}

export interface IncomeTemplate {
  id: string;
  label: string;
  amount: number;
  dayOfMonth: number;
  startDate: string;
  endDate: string | null;
  active: boolean;
  createdBy: UserSummary;
}

export interface Transaction {
  id: string;
  type: "income" | "expense";
  label: string | null;
  amount: number;
  date: string;
  category?: Category;
  subcategory?: Subcategory | null;
  createdBy: UserSummary;
}

export interface Dashboard {
  year: number;
  month: number;
  totalRevenus: number;
  totalDepensesRecurrentes: number;
  resteAVivreInitial: number;
  totalDepensesPonctuelles: number;
  resteAVivreActuel: number;
  transactionsRecentes: Transaction[];
}

export interface MonthlyTrendPoint {
  year: number;
  month: number;
  totalRevenus: number;
  totalDepensesRecurrentes: number;
  totalDepensesPonctuelles: number;
  resteAVivreActuel: number;
}

export interface CategoryBreakdown {
  categoryId: string;
  categoryName: string;
  icon: string | null;
  color: string | null;
  amount: number;
  percentage: number;
}

export interface AppSettings {
  id: string;
  monthStartDay: number;
}

export interface CategoryExpenseTransaction {
  id: string;
  label: string | null;
  amount: number;
  date: string;
  subcategoryId: string | null;
  subcategoryName: string | null;
  createdBy: UserSummary;
}

export interface CategoryRecurringOccurrence {
  templateId: string;
  label: string;
  amount: number;
  year: number;
  month: number;
  dayOfMonth: number;
  subcategoryName: string | null;
}

export interface CategoryTransactions {
  expenses: CategoryExpenseTransaction[];
  recurringOccurrences: CategoryRecurringOccurrence[];
}
