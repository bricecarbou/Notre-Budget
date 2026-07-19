import { prisma } from "../lib/prisma";
import { verifyPassword, hashPassword } from "../utils/password";
import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} from "../utils/jwt";

export class AuthError extends Error {}

export async function login(login: string, password: string) {
  const user = await prisma.user.findUnique({ where: { login } });
  if (!user || !user.active) {
    throw new AuthError("Identifiants invalides");
  }

  const valid = await verifyPassword(password, user.passwordHash);
  if (!valid) {
    throw new AuthError("Identifiants invalides");
  }

  const accessToken = signAccessToken({
    sub: user.id,
    login: user.login,
    role: user.role,
  });
  const refreshToken = signRefreshToken({ sub: user.id });

  return {
    accessToken,
    refreshToken,
    user: {
      id: user.id,
      login: user.login,
      name: user.name,
      role: user.role,
    },
  };
}

export async function refresh(refreshToken: string) {
  let payload;
  try {
    payload = verifyRefreshToken(refreshToken);
  } catch {
    throw new AuthError("Refresh token invalide ou expiré");
  }

  const user = await prisma.user.findUnique({ where: { id: payload.sub } });
  if (!user || !user.active) {
    throw new AuthError("Utilisateur introuvable ou désactivé");
  }

  const accessToken = signAccessToken({
    sub: user.id,
    login: user.login,
    role: user.role,
  });

  return { accessToken };
}

export async function changePassword(
  userId: string,
  currentPassword: string,
  newPassword: string
) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new AuthError("Utilisateur introuvable");

  const valid = await verifyPassword(currentPassword, user.passwordHash);
  if (!valid) throw new AuthError("Mot de passe actuel incorrect");

  const passwordHash = await hashPassword(newPassword);
  await prisma.user.update({ where: { id: userId }, data: { passwordHash } });
}
