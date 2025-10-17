import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import type { NextRequest } from "next/server";

const JWT_COOKIE_NAME = "app_token";
const JWT_EXPIRES_SECONDS = 60 * 60 * 24 * 7; // 7 days

export type JwtPayload = {
  userId: string;
  email: string;
};

export function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("Missing JWT_SECRET");
  return secret;
}

export function signJwt(payload: JwtPayload): string {
  return jwt.sign(payload, getJwtSecret(), { expiresIn: JWT_EXPIRES_SECONDS });
}

export function verifyJwt(token: string): JwtPayload | null {
  try {
    return jwt.verify(token, getJwtSecret()) as JwtPayload;
  } catch {
    return null;
  }
}

export function getAuthFromRequest(req: NextRequest): JwtPayload | null {
  const cookie = req.cookies.get(JWT_COOKIE_NAME)?.value;
  if (!cookie) return null;
  return verifyJwt(cookie);
}

export async function setAuthCookie(payload: JwtPayload) {
  const token = signJwt(payload);
  const c = await cookies();
  c.set(JWT_COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: JWT_EXPIRES_SECONDS,
  });
}

export async function clearAuthCookie() {
  const c = await cookies();
  c.delete(JWT_COOKIE_NAME);
}


