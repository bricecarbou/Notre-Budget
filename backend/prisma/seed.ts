import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

const DEFAULT_CATEGORIES: { name: string; subcategories?: string[] }[] = [
  { name: "Alimentaire" },
  { name: "Logement" },
  { name: "Transport" },
  { name: "Assurances", subcategories: ["Maison", "Voiture", "Santé"] },
  { name: "Crédits", subcategories: ["Immobilier", "Consommation"] },
  {
    name: "Abonnements",
    subcategories: ["Électricité", "Internet", "Téléphone", "Streaming"],
  },
  { name: "Loisirs" },
  { name: "Santé" },
  { name: "Impôts" },
];

async function seedAdmin() {
  const login = process.env.SEED_ADMIN_LOGIN;
  const password = process.env.SEED_ADMIN_PASSWORD;

  if (!login || !password) {
    console.warn(
      "SEED_ADMIN_LOGIN / SEED_ADMIN_PASSWORD non définis — admin non créé."
    );
    return;
  }

  const existing = await prisma.user.findUnique({ where: { login } });
  if (existing) {
    console.log(`Admin ${login} déjà présent, rien à faire.`);
    return;
  }

  const passwordHash = await bcrypt.hash(password, 10);
  await prisma.user.create({
    data: {
      login,
      passwordHash,
      name: "Admin",
      role: Role.ADMIN,
      active: true,
    },
  });
  console.log(`Admin ${login} créé.`);
}

async function seedCategories() {
  // Catégorie "Autres" : protégée, non supprimable/renommable (voir API).
  await prisma.category.upsert({
    where: { name: "Autres" },
    update: {},
    create: { name: "Autres", isDefault: true },
  });

  for (const cat of DEFAULT_CATEGORIES) {
    const category = await prisma.category.upsert({
      where: { name: cat.name },
      update: {},
      create: { name: cat.name, isDefault: false },
    });

    for (const subName of cat.subcategories ?? []) {
      await prisma.subcategory.upsert({
        where: { categoryId_name: { categoryId: category.id, name: subName } },
        update: {},
        create: { name: subName, categoryId: category.id },
      });
    }
  }
  console.log("Catégories par défaut synchronisées.");
}

async function main() {
  await seedAdmin();
  await seedCategories();
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
