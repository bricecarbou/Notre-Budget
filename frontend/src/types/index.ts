export type Role = "ADMIN" | "USER";

export interface UserSummary {
  id: string;
  name: string;
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
