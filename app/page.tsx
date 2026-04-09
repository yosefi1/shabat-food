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
      <main>
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
