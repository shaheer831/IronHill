import { Hero } from "../components/Hero";
import Lenis from "lenis";
import { Footer } from "../components/Footer";
import Spotlight from "../components/Spotlight/Spotlight";
import Testimonials from "../components/Testimonials/Testimonials";
import VirtualTourSection from "../components/VirtualTourSection/VirtualTourSection";
import FAQ from "../components/FAQ/FAQ";
// import CTABanner from "../components/CTABanner/CTABanner";

interface HomePageProps {
  lenis: Lenis | null;
}

export function HomePage({ lenis }: HomePageProps) {
  return (
    <>
      <Hero lenis={lenis} />
      <Spotlight />
      <Testimonials />
      <VirtualTourSection />
      <FAQ />
      {/* <CTABanner /> */}
      <Footer />
    </>
  );
}
