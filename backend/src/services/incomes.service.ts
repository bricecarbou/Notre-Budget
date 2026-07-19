import { prisma } from "../lib/prisma";
import { monthRange } from "../utils/dateRange";
import { getMonthStartDay } from "./settings.service";

export class IncomeError extends Error {
  constructor(message: string, public status = 400) {
    super(message);
  }
}

export async function listIncomes(year: number, month: number) {
  const startDay = await getMonthStartDay();
  const { start, end } = monthRange(year, month, startDay);
  return prisma.income.findMany({
    where: { date: { gte: start, lte: end } },
    include: { createdBy: { select: { id: true, name: true } } },
    orderBy: { date: "desc" },
  });
}

export function createIncome(data: {
  label: string;
  amount: number;
  date: Date;
  createdById: string;
}) {
  return prisma.income.create({ data });
}

export async function updateIncome(
  id: string,
  data: Partial<{ label: string; amount: number; date: Date }>
) {
  const income = await prisma.income.findUnique({ where: { id } });
  if (!income) throw new IncomeError("Revenu introuvable", 404);
  return prisma.income.update({ where: { id }, data });
}

export async function deleteIncome(id: string) {
  const income = await prisma.income.findUnique({ where: { id } });
  if (!income) throw new IncomeError("Revenu introuvable", 404);
  await prisma.income.delete({ where: { id } });
}
