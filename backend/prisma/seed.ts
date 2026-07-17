import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

const DEFAULT_CATEGORIES: {
  name: string;
  icon: string;
  color: string;
  subcategories?: string[];
}[] = [
  { name: "Alimentaire", icon: "ShoppingCart", color: "#3987e5" },
  { name: "Logement", icon: "Home", color: "#199e70" },
  { name: "Transport", icon: "Car", color: "#c98500" },
  {
    name: "Assurances",
    icon: "Shield",
    color: "#008300",
    subcategories: ["Maison", "Voiture", "Santé"],
  },
  {
    name: "Crédits",
    icon: "CreditCard",
    color: "#9085e9",
    subcategories: ["Immobilier", "Consommation"],
  },
  {
    name: "Abonnements",
    icon: "Repeat",
    color: "#e66767",
    subcategories: ["Électricité", "Internet", "Téléphone", "Streaming"],
  },
  { name: "Loisirs", icon: "Ticket", color: "#d55181" },
  { name: "Santé", icon: "HeartPulse", color: "#d95926" },
  { name: "Impôts", icon: "Landmark", color: "#0891b2" },
];

const AUTRES_ICON = "MoreHorizontal";
const AUTRES_COLOR = "#64748b";

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

// Ne backfill icon/color que s'ils sont encore vides, pour ne jamais écraser
// une personnalisation faite depuis l'écran Admin.
async function upsertCategoryWithDefaults(
  name: string,
  icon: string,
  color: string,
  isDefault: boolean
) {
  const existing = await prisma.category.findUnique({ where: { name } });
  if (!existing) {
    return prisma.category.create({ data: { name, icon, color, isDefault } });
  }
  if (!existing.icon || !existing.color) {
    return prisma.category.update({
      where: { name },
      data: { icon: existing.icon ?? icon, color: existing.color ?? color },
    });
  }
  return existing;
}

async function seedCategories() {
  // Catégorie "Autres" : protégée, non supprimable/renommable (voir API).
  await upsertCategoryWithDefaults("Autres", AUTRES_ICON, AUTRES_COLOR, true);

  for (const cat of DEFAULT_CATEGORIES) {
    const category = await upsertCategoryWithDefaults(cat.name, cat.icon, cat.color, false);

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
