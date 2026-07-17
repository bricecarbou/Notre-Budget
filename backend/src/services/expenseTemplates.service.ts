import { prisma } from "../lib/prisma";

export class ExpenseTemplateError extends Error {
  constructor(message: string, public status = 400) {
    super(message);
  }
}

export function listExpenseTemplates() {
  return prisma.expenseTemplate.findMany({
    include: {
      category: true,
      subcategory: true,
      createdBy: { select: { id: true, name: true } },
    },
    orderBy: { createdAt: "asc" },
  });
}

export function createExpenseTemplate(data: {
  label: string;
  amount: number;
  dayOfMonth: number;
  startDate: Date;
  endDate?: Date | null;
  categoryId: string;
  subcategoryId?: string;
  createdById: string;
}) {
  return prisma.expenseTemplate.create({ data });
}

export async function updateExpenseTemplate(
  id: string,
  data: Partial<{
    label: string;
    amount: number;
    dayOfMonth: number;
    startDate: Date;
    endDate: Date | null;
    categoryId: string;
    subcategoryId: string;
    active: boolean;
  }>
) {
  const template = await prisma.expenseTemplate.findUnique({ where: { id } });
  if (!template) throw new ExpenseTemplateError("Dépense récurrente introuvable", 404);
  return prisma.expenseTemplate.update({ where: { id }, data });
}

export async function deleteExpenseTemplate(id: string) {
  const template = await prisma.expenseTemplate.findUnique({ where: { id } });
  if (!template) throw new ExpenseTemplateError("Dépense récurrente introuvable", 404);
  await prisma.expenseTemplate.delete({ where: { id } });
}
