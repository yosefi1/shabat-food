import { NextRequest, NextResponse } from "next/server";
import { getSettings, saveSettings } from "@/lib/adminData";
import type { AdminSettings } from "@/lib/adminData";

export async function GET() {
  return NextResponse.json(await getSettings());
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json() as AdminSettings;
    await saveSettings(body);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[admin/settings PUT]", err);
    return NextResponse.json({ error: "שגיאה בשמירת הגדרות" }, { status: 500 });
  }
}
