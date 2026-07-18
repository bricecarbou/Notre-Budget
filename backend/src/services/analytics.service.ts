import { prisma } from "../lib/prisma";
import { monthRange } from "../utils/dateRange";
import { getDashboard } from "./dashboard.service";

function shiftMonth(year: number, month: number, offset: number) {
  const d = new Date(Date.UTC(year, month - 1 + offset, 1));
  return { year: d.getUTCFullYear(), month: d.getUTCMonth() + 1 };
}

export async function getMonthlyTrend(months: number, endYear?: number, endMonth?: number) {
  const now = new Date();
  const referenceYear = endYear ?? now.getUTCFullYear();
  const referenceMonth = endMonth ?? now.getUTCMonth() + 1;

  const results = [];
  for (let offset = -(months - 1); offset <= 0; offset++) {
    const { year, month } = shiftMonth(referenceYear, referenceMonth, offset);
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

// `months` agrège la période se terminant au mois donné (1 = ce mois
// seulement, 3/6/12 = les N derniers mois inclus). Chaque dépense récurrente
// active est comptée une fois par mois où elle l'était, pas une seule fois
// pour toute la période.
export async function getByCategory(year: number, month: number, months = 1) {
  const rangeStart = shiftMonth(year, month, -(months - 1));
  const overallStart = monthRange(rangeStart.year, rangeStart.month).start;
  const overallEnd = monthRange(year, month).end;

  const [expenses, allExpenseTemplates, categories] = await Promise.all([
    prisma.expense.findMany({ where: { date: { gte: overallStart, lte: overallEnd } } }),
    prisma.expenseTemplate.findMany({ where: { active: true } }),
    prisma.category.findMany(),
  ]);

  const totalsByCategory = new Map<string, number>();
  for (const e of expenses) {
    totalsByCategory.set(
      e.categoryId,
      (totalsByCategory.get(e.categoryId) ?? 0) + Number(e.amount)
    );
  }

  for (let offset = -(months - 1); offset <= 0; offset++) {
    const { year: y, month: m } = shiftMonth(year, month, offset);
    const { start, end } = monthRange(y, m);
    for (const t of allExpenseTemplates) {
      const activeThisMonth = t.startDate <= end && (t.endDate === null || t.endDate >= start);
      if (activeThisMonth) {
        totalsByCategory.set(
          t.categoryId,
          (totalsByCategory.get(t.categoryId) ?? 0) + Number(t.amount)
        );
      }
    }
  }

  const totalDepenses = [...totalsByCategory.values()].reduce((a, b) => a + b, 0);

  return categories
    .map((c) => {
      const amount = totalsByCategory.get(c.id) ?? 0;
      return {
        categoryId: c.id,
        categoryName: c.name,
        icon: c.icon,
        color: c.color,
        amount,
        percentage: totalDepenses > 0 ? (amount / totalDepenses) * 100 : 0,
      };
    })
    .filter((c) => c.amount > 0)
    .sort((a, b) => b.amount - a.amount);
}
