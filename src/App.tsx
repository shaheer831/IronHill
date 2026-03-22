import { useEffect, useRef, useState, useCallback } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Menu from "./components/Menu/Menu";
import Cursor from "./components/Cursor";
import { HomePage } from "./pages/HomePage";
import Preloader from "./components/Preloader";
import Studio from "./pages/Studio";
import Work from "./pages/Work";
import Contact from "./pages/Contact";
import Advisory from "./pages/Advisory";
import News from "./pages/News";
import Design from "./pages/Design";
import Careers from "./pages/Careers";
import "./App.css";
import VirtualTour from "./pages/VirtualTour";

gsap.registerPlugin(ScrollTrigger);

interface AppContentProps {
  ready: boolean;
}

function AppContent({ ready }: AppContentProps) {
  const pageRef = useRef<HTMLDivElement>(null);
  const [lenis, setLenis] = useState<Lenis | null>(null);
  const location = useLocation();

  // Only start Lenis after the preloader has finished — avoids running the
  // RAF loop against a visibility:hidden DOM and misaligning ScrollTrigger.
  useEffect(() => {
    if (!ready) return;
    const lenisInstance = new Lenis();
    function raf(time: number) {
      lenisInstance.raf(time);
      ScrollTrigger.update();
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
    lenisInstance.on("scroll", ScrollTrigger.update);
    setLenis(lenisInstance);
    return () => { lenisInstance.destroy(); };
  }, [ready]);

  useEffect(() => {
    if (lenis) lenis.scrollTo(0, { immediate: true });
    ScrollTrigger.refresh();
  }, [location.pathname, lenis]);

  return (
    <>
      <Cursor />
      <Menu lenis={lenis} />
      <div className="relative z-0" ref={pageRef}>
        <Routes>
          <Route path="/" element={<HomePage lenis={lenis} />} />
          <Route path="/studio" element={<Studio />} />
          <Route path="/work" element={<Work />} />
          <Route path="/design" element={<Design />} />
          <Route path="/news" element={<News />} />
          <Route path="/advisory" element={<Advisory />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/careers" element={<Careers />} />
          <Route path="/virtual-tour" element={<VirtualTour />} />
        </Routes>
      </div>
    </>
  );
}

function App() {
  const [loaded, setLoaded] = useState(false);
  const handlePreloadDone = useCallback(() => setLoaded(true), []);

  return (
    <BrowserRouter>
      {!loaded && <Preloader onComplete={handlePreloadDone} />}
      <div style={{ visibility: loaded ? "visible" : "hidden" }}>
        <AppContent ready={loaded} />
      </div>
    </BrowserRouter>
  );
}

export default App;
