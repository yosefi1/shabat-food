import { NextRequest, NextResponse } from "next/server";
import { getAdminMenuItems, getAdminCategories, saveAdminMenuItem } from "@/lib/adminData";
import { randomUUID } from "crypto";
import type { AdminMenuItem } from "@/lib/adminData";

export async function GET() {
  return NextResponse.json({
    items:      await getAdminMenuItems(),
    categories: getAdminCategories(),
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as Partial<AdminMenuItem>;

    if (!body.name?.trim())     return NextResponse.json({ error: "שם חסר" }, { status: 400 });
    if (!body.category?.trim()) return NextResponse.json({ error: "קטגוריה חסרה" }, { status: 400 });

    const item: AdminMenuItem = {
      id:          `item-${randomUUID().slice(0, 8)}`,
      name:        String(body.name).trim(),
      description: String(body.description ?? "").trim(),
      price:       Number(body.price ?? 0),
      image:       String(body.image ?? "").trim(),
      category:    String(body.category).trim(),
      badge:       body.badge,
      available:   body.available !== false,
    };

    await saveAdminMenuItem(item);
    return NextResponse.json(item, { status: 201 });
  } catch (err) {
    console.error("[admin/menu POST]", err);
    return NextResponse.json({ error: "שגיאה בשמירת פריט" }, { status: 500 });
  }
}
