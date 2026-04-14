export const dynamic = "force-dynamic";

import Header       from "@/components/Header";
import Hero          from "@/components/Hero";
import Menu          from "@/components/Menu";
import AboutSection  from "@/components/AboutSection";
import Footer        from "@/components/Footer";
import CartDrawer    from "@/components/CartDrawer";
import { menuItems as staticItems } from "@/data/menuData";
import type { MenuItem } from "@/types";

async function getMenuItems(): Promise<MenuItem[]> {
  try {
    const { createClient } = await import("@supabase/supabase-js");
    const url = process.env.SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_KEY;
    if (!url || !key) return staticItems;

    const supabase = createClient(url, key, { auth: { persistSession: false } });
    const { data, error } = await supabase
      .from("menu_items")
      .select("*")
      .eq("available", true)
      .order("sort_order", { ascending: true });

    if (error || !data || data.length === 0) return staticItems;

    return data.map((row) => ({
      id:          row.id,
      name:        row.name,
      description: row.description ?? "",
      price:       Number(row.price),
      image:       row.image ?? "",
      category:    row.category,
      badge:       row.badge ?? undefined,
    }));
  } catch {
    return staticItems;
  }
}

export default async function Home() {
  const items = await getMenuItems();

  return (
    <>
      <Header />
      <main id="main-content" tabIndex={-1} className="outline-none">
        <Hero />
        <Menu items={items} />
        <AboutSection />
      </main>
      <Footer />
      <CartDrawer />
    </>
  );
}
