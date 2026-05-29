import Navbar from "@/components/sections/navbar";
import Hero from "@/components/sections/hero";
import LogoCloud from "@/components/sections/logo-cloud";
import Features from "@/components/sections/features";
import HowItWorks from "@/components/sections/how-it-works";
import Testimonials from "@/components/sections/testimonials";
import FAQ from "@/components/sections/faq";
import CTA from "@/components/sections/cta";
import Footer from "@/components/sections/footer";
import LayoutGridDemo from "@/components/layout-grid-demo";

export default function Page() {
  return (
    <>
  <Navbar />
    <main className="flex min-h-dvh flex-col">
      <Hero />
      <LogoCloud />
      <Features />
      <HowItWorks />
      <Testimonials />
      <LayoutGridDemo />
      <FAQ />
      <CTA />
    </main>
    <Footer />
    </>
  );
}
