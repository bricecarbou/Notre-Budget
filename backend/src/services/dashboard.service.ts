import { prisma } from "../lib/prisma";
import { monthRange } from "../utils/dateRange";
import { getMonthStartDay } from "./settings.service";

// Logique métier centralisée (voir spec section 4) — ne jamais dupliquer côté frontend.
export async function getDashboard(year: number, month: number) {
  const startDay = await getMonthStartDay();
  const { start, end } = monthRange(year, month, startDay);

  const activeTemplateFilter = {
    active: true,
    startDate: { lte: end },
    OR: [{ endDate: null }, { endDate: { gte: start } }],
  };

  const [incomeTemplates, expenseTemplates, incomesPonctuels, expensesPonctuels] =
    await Promise.all([
      prisma.incomeTemplate.findMany({ where: activeTemplateFilter }),
      prisma.expenseTemplate.findMany({
        where: activeTemplateFilter,
        include: { category: true, subcategory: true },
      }),
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

  const sum = (values: { amount: unknown }[]) =>
    values.reduce((acc, v) => acc + Number(v.amount), 0);

  const totalRevenusTemplates = sum(incomeTemplates);
  const totalRevenusPonctuels = sum(incomesPonctuels);
  const totalRevenus = totalRevenusTemplates + totalRevenusPonctuels;

  const totalDepensesRecurrentes = sum(expenseTemplates);

  const resteAVivreInitial = totalRevenus - totalDepensesRecurrentes;

  const totalDepensesPonctuelles = sum(expensesPonctuels);

  const resteAVivreActuel = resteAVivreInitial - totalDepensesPonctuelles;

  const transactionsRecentes = [
    ...incomesPonctuels.map((i) => ({
      id: i.id,
      type: "income" as const,
      label: i.label,
      amount: Number(i.amount),
      date: i.date,
      createdBy: i.createdBy,
    })),
    ...expensesPonctuels.map((e) => ({
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

  return {
    year,
    month,
    totalRevenus,
    totalDepensesRecurrentes,
    resteAVivreInitial,
    totalDepensesPonctuelles,
    resteAVivreActuel,
    transactionsRecentes,
  };
}
