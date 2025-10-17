import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { setAuthCookie } from "@/lib/auth";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();
    if (!email || !password) {
      return NextResponse.json({ error: "Email and password required" }, { status: 400 });
    }
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    setAuthCookie({ userId: user.id, email: user.email });
    return NextResponse.json({ id: user.id, email: user.email, name: user.name });
  } catch (e) {
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}


