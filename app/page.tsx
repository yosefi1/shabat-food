import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Menu from "@/components/Menu";
import AboutSection from "@/components/AboutSection";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";

export default function Home() {
  return (
    <>
      <Header />
      {/* tabindex="-1" enables programmatic focus from the skip link (WCAG 2.4.1 fix C7) */}
      <main id="main-content" tabIndex={-1} className="outline-none">
        <Hero />
        <Menu />
        <AboutSection />
      </main>
      <Footer />
      {/* Cart drawer lives outside main so it can overlay everything */}
      <CartDrawer />
    </>
  );
}
