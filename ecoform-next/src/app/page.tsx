import { Navbar } from "@/components/sections/navbar";
import { Hero } from "@/components/sections/hero";
import { Products } from "@/components/sections/products";
import { Pricing } from "@/components/sections/pricing";
import { About } from "@/components/sections/about";
import { Contact } from "@/components/sections/contact";
import { Footer } from "@/components/sections/footer";

export default function Home() {
  return (
    <main>
      <Navbar />
      <Hero />
      <Products />
      <Pricing />
      <About />
      <Contact />
      <Footer />
    </main>
  );
}
