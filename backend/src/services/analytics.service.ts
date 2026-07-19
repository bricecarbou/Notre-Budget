import { prisma } from "../lib/prisma";
import { monthRange, shiftMonth } from "../utils/dateRange";
import { getDashboard } from "./dashboard.service";
import { getMonthStartDay } from "./settings.service";

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
  const startDay = await getMonthStartDay();
  const rangeStart = shiftMonth(year, month, -(months - 1));
  const overallStart = monthRange(rangeStart.year, rangeStart.month, startDay).start;
  const overallEnd = monthRange(year, month, startDay).end;

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
    const { start, end } = monthRange(y, m, startDay);
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

// Détail des transactions d'une catégorie sur la période (pour le clic sur
// une part de camembert / une ligne du tableau dans Analyses). Les dépenses
// ponctuelles sont de vraies transactions (éditables) ; les occurrences
// récurrentes sont des instances calculées (une par mois où le modèle était
// actif), en lecture seule ici — elles se gèrent depuis l'écran Récurrents.
export async function getCategoryTransactions(
  categoryId: string,
  year: number,
  month: number,
  months = 1
) {
  const startDay = await getMonthStartDay();
  const rangeStart = shiftMonth(year, month, -(months - 1));
  const overallStart = monthRange(rangeStart.year, rangeStart.month, startDay).start;
  const overallEnd = monthRange(year, month, startDay).end;

  const [expenses, templates] = await Promise.all([
    prisma.expense.findMany({
      where: { categoryId, date: { gte: overallStart, lte: overallEnd } },
      include: { subcategory: true, createdBy: { select: { id: true, name: true } } },
      orderBy: { date: "desc" },
    }),
    prisma.expenseTemplate.findMany({
      where: { categoryId, active: true },
      include: { subcategory: true },
    }),
  ]);

  const recurringOccurrences: {
    templateId: string;
    label: string;
    amount: number;
    year: number;
    month: number;
    dayOfMonth: number;
    subcategoryName: string | null;
  }[] = [];

  for (let offset = -(months - 1); offset <= 0; offset++) {
    const { year: y, month: m } = shiftMonth(year, month, offset);
    const { start, end } = monthRange(y, m, startDay);
    for (const t of templates) {
      const activeThisMonth = t.startDate <= end && (t.endDate === null || t.endDate >= start);
      if (activeThisMonth) {
        recurringOccurrences.push({
          templateId: t.id,
          label: t.label,
          amount: Number(t.amount),
          year: y,
          month: m,
          dayOfMonth: t.dayOfMonth,
          subcategoryName: t.subcategory?.name ?? null,
        });
      }
    }
  }

  recurringOccurrences.sort((a, b) =>
    a.year !== b.year ? b.year - a.year : b.month - a.month
  );

  return {
    expenses: expenses.map((e) => ({
      id: e.id,
      label: e.label,
      amount: Number(e.amount),
      date: e.date,
      subcategoryId: e.subcategoryId,
      subcategoryName: e.subcategory?.name ?? null,
      createdBy: e.createdBy,
    })),
    recurringOccurrences,
  };
}
