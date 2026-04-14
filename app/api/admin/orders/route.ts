import { NextRequest, NextResponse } from "next/server";
import { getOrders } from "@/lib/adminData";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;
    const q      = searchParams.get("q")?.toLowerCase() ?? "";
    const status = searchParams.get("status") ?? "all";
    const date   = searchParams.get("date") ?? "";

    let orders = getOrders();

    if (status !== "all") orders = orders.filter((o) => o.status === status);
    if (date)             orders = orders.filter((o) => o.createdAt.startsWith(date));
    if (q) {
      orders = orders.filter(
        (o) =>
          o.customer.name.toLowerCase().includes(q) ||
          o.customer.phone.includes(q) ||
          o.orderId.toLowerCase().includes(q)
      );
    }

    return NextResponse.json(orders);
  } catch (err) {
    console.error("[admin/orders GET]", err);
    return NextResponse.json({ error: "שגיאה בטעינת הזמנות" }, { status: 500 });
  }
}
