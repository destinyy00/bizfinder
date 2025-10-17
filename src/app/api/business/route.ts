import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getAuthFromRequest } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const auth = getAuthFromRequest(req);
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const body = await req.json();
    const {
      name,
      description,
      category,
      phone,
      website,
      addressLine1,
      addressLine2,
      city,
      state,
      postalCode,
      country,
      latitude,
      longitude,
    } = body ?? {};

    if (!name || latitude == null || longitude == null) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }
    const biz = await prisma.business.create({
      data: {
        name,
        description,
        category,
        phone,
        website,
        addressLine1,
        addressLine2,
        city,
        state,
        postalCode,
        country,
        latitude: Number(latitude),
        longitude: Number(longitude),
        ownerId: auth.userId,
      },
    });
    return NextResponse.json({ id: biz.id });
  } catch (e) {
    return NextResponse.json({ error: "Create failed" }, { status: 500 });
  }
}


