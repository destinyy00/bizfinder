import { NextRequest, NextResponse } from "next/server";
import { getAuthFromRequest } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { promises as fs } from "fs";
import path from "path";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const auth = getAuthFromRequest(req);
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const formData = await req.formData();
  const file = formData.get("file");
  const businessId = formData.get("businessId") as string | null;
  if (!file || typeof file === "string" || !businessId) {
    return NextResponse.json({ error: "Missing file or businessId" }, { status: 400 });
  }

  const biz = await prisma.business.findFirst({ where: { id: businessId, ownerId: auth.userId } });
  if (!biz) return NextResponse.json({ error: "Business not found" }, { status: 404 });

  const bytes = Buffer.from(await file.arrayBuffer());
  const ext = (file as File).name.split(".").pop() || "bin";
  const fileName = `${businessId}-${Date.now()}.${ext}`;
  const uploadDir = path.join(process.cwd(), "public", "uploads");
  await fs.mkdir(uploadDir, { recursive: true });
  const filePath = path.join(uploadDir, fileName);
  await fs.writeFile(filePath, bytes);
  const url = `/uploads/${fileName}`;

  const photo = await prisma.photo.create({ data: { businessId, url, caption: biz.name } });
  return NextResponse.json({ url: photo.url, id: photo.id });
}


