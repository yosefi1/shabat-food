import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { randomUUID } from "crypto";

const BUCKET = "menu-images";
const MAX_MB  = 5;

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) return NextResponse.json({ error: "לא נבחר קובץ" }, { status: 400 });
    if (!file.type.startsWith("image/")) return NextResponse.json({ error: "יש להעלות קובץ תמונה בלבד" }, { status: 400 });
    if (file.size > MAX_MB * 1024 * 1024) return NextResponse.json({ error: `הקובץ גדול מדי (מקסימום ${MAX_MB}MB)` }, { status: 400 });

    const ext      = file.name.split(".").pop() ?? "jpg";
    const filename = `${randomUUID()}.${ext}`;
    const buffer   = Buffer.from(await file.arrayBuffer());

    const { error } = await supabase.storage
      .from(BUCKET)
      .upload(filename, buffer, {
        contentType:  file.type,
        cacheControl: "3600",
        upsert:       false,
      });

    if (error) {
      console.error("[upload]", error.message);
      return NextResponse.json({ error: "שגיאה בהעלאה לאחסון" }, { status: 500 });
    }

    const { data: { publicUrl } } = supabase.storage.from(BUCKET).getPublicUrl(filename);
    return NextResponse.json({ url: publicUrl });
  } catch (err) {
    console.error("[upload]", err);
    return NextResponse.json({ error: "שגיאה בהעלאה" }, { status: 500 });
  }
}
