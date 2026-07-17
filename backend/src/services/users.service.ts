import { prisma } from "../lib/prisma";
import { hashPassword } from "../utils/password";
import type { Role } from "@prisma/client";

export class UserError extends Error {
  constructor(message: string, public status = 400) {
    super(message);
  }
}

const publicSelect = {
  id: true,
  email: true,
  name: true,
  role: true,
  active: true,
  createdAt: true,
};

export function listUsers() {
  return prisma.user.findMany({ select: publicSelect, orderBy: { createdAt: "asc" } });
}

export async function createUser(data: {
  email: string;
  name: string;
  password: string;
  role: Role;
}) {
  const existing = await prisma.user.findUnique({ where: { email: data.email } });
  if (existing) throw new UserError("Un utilisateur avec cet email existe déjà", 409);

  const passwordHash = await hashPassword(data.password);
  return prisma.user.create({
    data: {
      email: data.email,
      name: data.name,
      role: data.role,
      passwordHash,
    },
    select: publicSelect,
  });
}

export async function updateUser(
  id: string,
  data: { name?: string; role?: Role; active?: boolean; password?: string }
) {
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) throw new UserError("Utilisateur introuvable", 404);

  const updateData: Record<string, unknown> = {
    name: data.name,
    role: data.role,
    active: data.active,
  };
  if (data.password) {
    updateData.passwordHash = await hashPassword(data.password);
  }

  return prisma.user.update({ where: { id }, data: updateData, select: publicSelect });
}

export async function deactivateUser(id: string) {
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) throw new UserError("Utilisateur introuvable", 404);
  return prisma.user.update({ where: { id }, data: { active: false }, select: publicSelect });
}
