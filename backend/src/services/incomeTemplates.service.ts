import { prisma } from "../lib/prisma";

export class IncomeTemplateError extends Error {
  constructor(message: string, public status = 400) {
    super(message);
  }
}

export function listIncomeTemplates() {
  return prisma.incomeTemplate.findMany({
    include: { createdBy: { select: { id: true, name: true } } },
    orderBy: { createdAt: "asc" },
  });
}

export function createIncomeTemplate(data: {
  label: string;
  amount: number;
  dayOfMonth: number;
  startDate: Date;
  endDate?: Date | null;
  createdById: string;
}) {
  return prisma.incomeTemplate.create({ data });
}

export async function updateIncomeTemplate(
  id: string,
  data: Partial<{
    label: string;
    amount: number;
    dayOfMonth: number;
    startDate: Date;
    endDate: Date | null;
    active: boolean;
  }>
) {
  const template = await prisma.incomeTemplate.findUnique({ where: { id } });
  if (!template) throw new IncomeTemplateError("Revenu récurrent introuvable", 404);
  return prisma.incomeTemplate.update({ where: { id }, data });
}

export async function deleteIncomeTemplate(id: string) {
  const template = await prisma.incomeTemplate.findUnique({ where: { id } });
  if (!template) throw new IncomeTemplateError("Revenu récurrent introuvable", 404);
  await prisma.incomeTemplate.delete({ where: { id } });
}
