import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { setAuthCookie } from "@/lib/auth";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password, name } = body ?? {};
    if (!email || !password) {
      return NextResponse.json({ error: "Email and password required" }, { status: 400 });
    }
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ error: "Email already registered" }, { status: 409 });
    }
    const hash = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({ data: { email, name, password: hash } });
    setAuthCookie({ userId: user.id, email: user.email });
    return NextResponse.json({ id: user.id, email: user.email, name: user.name });
  } catch (e) {
    return NextResponse.json({ error: "Registration failed" }, { status: 500 });
  }
}


