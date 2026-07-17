import { prisma } from "../lib/prisma";

export class CategoryError extends Error {
  constructor(message: string, public status = 400) {
    super(message);
  }
}

export function listCategories() {
  return prisma.category.findMany({
    include: { subcategories: true },
    orderBy: { name: "asc" },
  });
}

export function createCategory(data: {
  name: string;
  icon?: string;
  color?: string;
}) {
  return prisma.category.create({ data });
}

export async function updateCategory(
  id: string,
  data: { name?: string; icon?: string; color?: string }
) {
  const category = await prisma.category.findUnique({ where: { id } });
  if (!category) throw new CategoryError("Catégorie introuvable", 404);
  if (category.isDefault && data.name && data.name !== category.name) {
    throw new CategoryError("La catégorie 'Autres' ne peut pas être renommée", 403);
  }
  return prisma.category.update({ where: { id }, data });
}

async function getOrCreateAutresCategory() {
  const autres = await prisma.category.findFirst({ where: { isDefault: true } });
  if (!autres) throw new CategoryError("Catégorie par défaut 'Autres' manquante", 500);
  return autres;
}

export async function deleteCategory(id: string) {
  const category = await prisma.category.findUnique({ where: { id } });
  if (!category) throw new CategoryError("Catégorie introuvable", 404);
  if (category.isDefault) {
    throw new CategoryError("La catégorie 'Autres' ne peut pas être supprimée", 403);
  }

  const autres = await getOrCreateAutresCategory();

  await prisma.$transaction([
    prisma.expense.updateMany({
      where: { categoryId: id },
      data: { categoryId: autres.id, subcategoryId: null },
    }),
    prisma.expenseTemplate.updateMany({
      where: { categoryId: id },
      data: { categoryId: autres.id, subcategoryId: null },
    }),
    prisma.category.delete({ where: { id } }),
  ]);
}

export async function createSubcategory(categoryId: string, name: string) {
  const category = await prisma.category.findUnique({ where: { id: categoryId } });
  if (!category) throw new CategoryError("Catégorie introuvable", 404);
  return prisma.subcategory.create({ data: { name, categoryId } });
}

export async function updateSubcategory(id: string, name: string) {
  const sub = await prisma.subcategory.findUnique({ where: { id } });
  if (!sub) throw new CategoryError("Sous-catégorie introuvable", 404);
  return prisma.subcategory.update({ where: { id }, data: { name } });
}

export async function deleteSubcategory(id: string) {
  const sub = await prisma.subcategory.findUnique({ where: { id } });
  if (!sub) throw new CategoryError("Sous-catégorie introuvable", 404);

  await prisma.$transaction([
    prisma.expense.updateMany({ where: { subcategoryId: id }, data: { subcategoryId: null } }),
    prisma.expenseTemplate.updateMany({ where: { subcategoryId: id }, data: { subcategoryId: null } }),
    prisma.subcategory.delete({ where: { id } }),
  ]);
}
