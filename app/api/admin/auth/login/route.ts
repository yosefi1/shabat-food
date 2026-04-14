import { NextRequest, NextResponse } from "next/server";
import { signAdminToken, safeCompare, SESSION_COOKIE } from "@/lib/auth";

export async function POST(req: NextRequest) {
  let password: string;
  try {
    const body = await req.json();
    password = String(body?.password ?? "");
  } catch {
    return NextResponse.json({ success: false, message: "בקשה לא תקינה" }, { status: 400 });
  }

  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword) {
    console.error("[admin/auth] ADMIN_PASSWORD is not set in environment");
    return NextResponse.json({ success: false, message: "שגיאת הגדרה בשרת" }, { status: 500 });
  }

  if (!safeCompare(password, adminPassword)) {
    // Delay to slow down brute-force attempts
    await new Promise((r) => setTimeout(r, 500));
    return NextResponse.json({ success: false, message: "סיסמה שגויה" }, { status: 401 });
  }

  const token = await signAdminToken();
  const res   = NextResponse.json({ success: true });

  res.cookies.set({ ...SESSION_COOKIE, value: token });
  return res;
}
