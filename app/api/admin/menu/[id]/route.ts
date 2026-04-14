import { NextRequest, NextResponse } from "next/server";
import { getAdminMenuItems, saveAdminMenuItem, deleteAdminMenuItem } from "@/lib/adminData";
import type { AdminMenuItem } from "@/lib/adminData";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const item = (await getAdminMenuItems()).find((i) => i.id === id);
  if (!item) return NextResponse.json({ error: "פריט לא נמצא" }, { status: 404 });
  return NextResponse.json(item);
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const body = await req.json() as Partial<AdminMenuItem>;
    const existing = (await getAdminMenuItems()).find((i) => i.id === id);
    if (!existing) return NextResponse.json({ error: "פריט לא נמצא" }, { status: 404 });

    const updated: AdminMenuItem = {
      ...existing,
      name:        String(body.name ?? existing.name).trim(),
      description: String(body.description ?? existing.description).trim(),
      price:       Number(body.price ?? existing.price),
      image:       String(body.image ?? existing.image).trim(),
      category:    String(body.category ?? existing.category).trim(),
      badge:       body.badge !== undefined ? body.badge : existing.badge,
      available:   body.available !== undefined ? Boolean(body.available) : existing.available,
    };

    await saveAdminMenuItem(updated);
    return NextResponse.json(updated);
  } catch (err) {
    console.error("[admin/menu PUT]", err);
    return NextResponse.json({ error: "שגיאה בעדכון פריט" }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const existing = (await getAdminMenuItems()).find((i) => i.id === id);
  if (!existing) return NextResponse.json({ error: "פריט לא נמצא" }, { status: 404 });
  await deleteAdminMenuItem(id);
  return NextResponse.json({ success: true });
}
