import jwt, { type SignOptions } from "jsonwebtoken";
import type { Role } from "@prisma/client";

export interface AccessTokenPayload {
  sub: string;
  login: string;
  role: Role;
}

export interface RefreshTokenPayload {
  sub: string;
}

function getSecret(name: "JWT_SECRET" | "JWT_REFRESH_SECRET"): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing env var ${name}`);
  return value;
}

export function signAccessToken(payload: AccessTokenPayload): string {
  return jwt.sign(payload, getSecret("JWT_SECRET"), {
    expiresIn: (process.env.JWT_ACCESS_EXPIRES_IN || "15m") as SignOptions["expiresIn"],
  });
}

export function signRefreshToken(payload: RefreshTokenPayload): string {
  return jwt.sign(payload, getSecret("JWT_REFRESH_SECRET"), {
    expiresIn: (process.env.JWT_REFRESH_EXPIRES_IN || "30d") as SignOptions["expiresIn"],
  });
}

export function verifyAccessToken(token: string): AccessTokenPayload {
  return jwt.verify(token, getSecret("JWT_SECRET")) as AccessTokenPayload;
}

export function verifyRefreshToken(token: string): RefreshTokenPayload {
  return jwt.verify(token, getSecret("JWT_REFRESH_SECRET")) as RefreshTokenPayload;
}
