import { prisma } from "../lib/prisma";
import { monthRange } from "../utils/dateRange";
import { getDashboard } from "./dashboard.service";

function shiftMonth(year: number, month: number, offset: number) {
  const d = new Date(Date.UTC(year, month - 1 + offset, 1));
  return { year: d.getUTCFullYear(), month: d.getUTCMonth() + 1 };
}

export async function getMonthlyTrend(months: number) {
  const now = new Date();
  const currentYear = now.getUTCFullYear();
  const currentMonth = now.getUTCMonth() + 1;

  const results = [];
  for (let offset = -(months - 1); offset <= 0; offset++) {
    const { year, month } = shiftMonth(currentYear, currentMonth, offset);
    const dashboard = await getDashboard(year, month);
    results.push({
      year,
      month,
      totalRevenus: dashboard.totalRevenus,
      totalDepensesRecurrentes: dashboard.totalDepensesRecurrentes,
      totalDepensesPonctuelles: dashboard.totalDepensesPonctuelles,
      resteAVivreActuel: dashboard.resteAVivreActuel,
    });
  }
  return results;
}

export async function getByCategory(year: number, month: number) {
  const { start, end } = monthRange(year, month);

  const activeTemplateFilter = {
    active: true,
    startDate: { lte: end },
    OR: [{ endDate: null }, { endDate: { gte: start } }],
  };

  const [expenses, expenseTemplates, categories] = await Promise.all([
    prisma.expense.findMany({ where: { date: { gte: start, lte: end } } }),
    prisma.expenseTemplate.findMany({ where: activeTemplateFilter }),
    prisma.category.findMany(),
  ]);

  const totalsByCategory = new Map<string, number>();
  for (const e of expenses) {
    totalsByCategory.set(
      e.categoryId,
      (totalsByCategory.get(e.categoryId) ?? 0) + Number(e.amount)
    );
  }
  for (const t of expenseTemplates) {
    totalsByCategory.set(
      t.categoryId,
      (totalsByCategory.get(t.categoryId) ?? 0) + Number(t.amount)
    );
  }

  const totalDepenses = [...totalsByCategory.values()].reduce((a, b) => a + b, 0);

  return categories
    .map((c) => {
      const amount = totalsByCategory.get(c.id) ?? 0;
      return {
        categoryId: c.id,
        categoryName: c.name,
        color: c.color,
        amount,
        percentage: totalDepenses > 0 ? (amount / totalDepenses) * 100 : 0,
      };
    })
    .filter((c) => c.amount > 0)
    .sort((a, b) => b.amount - a.amount);
}
