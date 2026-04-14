import { NextResponse } from "next/server";
import { getDashboardStats } from "@/lib/adminData";

export async function GET() {
  try {
    return NextResponse.json(await getDashboardStats());
  } catch (err) {
    console.error("[admin/dashboard]", err);
    return NextResponse.json({ error: "שגיאה בטעינת נתוני לוח בקרה" }, { status: 500 });
  }
}
