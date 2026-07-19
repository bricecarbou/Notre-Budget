import { prisma } from "../lib/prisma";
import { monthRange, shiftMonth } from "../utils/dateRange";
import { getMonthStartDay } from "./settings.service";

// Dépenses + revenus ponctuels combinés sur la période se terminant au mois
// donné (1 = ce mois seulement, 3/6/12 = les N derniers mois inclus).
export async function getTransactions(year: number, month: number, months = 1) {
  const startDay = await getMonthStartDay();
  const rangeStart = shiftMonth(year, month, -(months - 1));
  const start = monthRange(rangeStart.year, rangeStart.month, startDay).start;
  const end = monthRange(year, month, startDay).end;

  const [incomes, expenses] = await Promise.all([
    prisma.income.findMany({
      where: { date: { gte: start, lte: end } },
      include: { createdBy: { select: { id: true, name: true } } },
    }),
    prisma.expense.findMany({
      where: { date: { gte: start, lte: end } },
      include: {
        category: true,
        subcategory: true,
        createdBy: { select: { id: true, name: true } },
      },
    }),
  ]);

  const transactions = [
    ...incomes.map((i) => ({
      id: i.id,
      type: "income" as const,
      label: i.label,
      amount: Number(i.amount),
      date: i.date,
      createdBy: i.createdBy,
    })),
    ...expenses.map((e) => ({
      id: e.id,
      type: "expense" as const,
      label: e.label,
      amount: Number(e.amount),
      date: e.date,
      category: e.category,
      subcategory: e.subcategory,
      createdBy: e.createdBy,
    })),
  ].sort((a, b) => b.date.getTime() - a.date.getTime());

  return transactions;
}
