import { NextRequest, NextResponse } from "next/server";
import { getOrderById, updateOrderStatus } from "@/lib/adminData";
import type { OrderStatus } from "@/lib/adminData";

const ALLOWED_STATUSES: OrderStatus[] = ["new","processing","ready","delivered","cancelled"];

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const order = getOrderById(id);
  if (!order) return NextResponse.json({ error: "הזמנה לא נמצאה" }, { status: 404 });
  return NextResponse.json(order);
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const body   = await req.json();
    const status = body?.status as OrderStatus;

    if (!ALLOWED_STATUSES.includes(status)) {
      return NextResponse.json({ error: "סטטוס לא תקין" }, { status: 400 });
    }

    const order = getOrderById(id);
    if (!order) return NextResponse.json({ error: "הזמנה לא נמצאה" }, { status: 404 });

    updateOrderStatus(id, status);
    return NextResponse.json({ success: true, orderId: id, status });
  } catch (err) {
    console.error("[admin/orders PATCH]", err);
    return NextResponse.json({ error: "שגיאה בעדכון סטטוס" }, { status: 500 });
  }
}
