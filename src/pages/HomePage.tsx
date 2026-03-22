import { Hero } from "../components/Hero";
import Lenis from "lenis";
import { Footer } from "../components/Footer";
import Spotlight from "../components/Spotlight/Spotlight";

interface HomePageProps {
  lenis: Lenis | null;
}

export function HomePage({ lenis }: HomePageProps) {
  return (
    <>
      <Hero lenis={lenis} />
      <Spotlight />
      <Footer />
    </>
  );
}
