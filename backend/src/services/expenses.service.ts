import { prisma } from "../lib/prisma";
import { monthRange } from "../utils/dateRange";

export class ExpenseError extends Error {
  constructor(message: string, public status = 400) {
    super(message);
  }
}

export function listExpenses(year: number, month: number) {
  const { start, end } = monthRange(year, month);
  return prisma.expense.findMany({
    where: { date: { gte: start, lte: end } },
    include: {
      category: true,
      subcategory: true,
      createdBy: { select: { id: true, name: true } },
    },
    orderBy: { date: "desc" },
  });
}

export function createExpense(data: {
  label?: string;
  amount: number;
  date: Date;
  categoryId: string;
  subcategoryId?: string;
  createdById: string;
}) {
  return prisma.expense.create({ data });
}

export async function updateExpense(
  id: string,
  data: Partial<{
    label: string;
    amount: number;
    date: Date;
    categoryId: string;
    subcategoryId: string;
  }>
) {
  const expense = await prisma.expense.findUnique({ where: { id } });
  if (!expense) throw new ExpenseError("Dépense introuvable", 404);
  return prisma.expense.update({ where: { id }, data });
}

export async function deleteExpense(id: string) {
  const expense = await prisma.expense.findUnique({ where: { id } });
  if (!expense) throw new ExpenseError("Dépense introuvable", 404);
  await prisma.expense.delete({ where: { id } });
}
