import { Hero } from "../components/Hero";
import Lenis from "lenis";
import { Footer } from "../components/Footer";

interface HomePageProps {
  lenis: Lenis | null;
}

export function HomePage({ lenis }: HomePageProps) {
  return (
    <>
      <Hero lenis={lenis} />
      <Footer />
    </>
  );
}
