import { useEffect, useRef, useState } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Lenis from "lenis";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import gsap from "gsap";
import Menu from "./components/Menu/Menu";
import Cursor from "./components/Cursor";
import { HomePage } from "./pages/HomePage";
import "./App.css";

gsap.registerPlugin(ScrollTrigger);
  import LocomotiveScroll from 'locomotive-scroll';
import Studio from "./pages/Studio";
import Work from "./pages/Work";
import Contact from "./pages/Contact";
import Advisory from "./pages/Advisory";
import News from "./pages/News";
import Design from "./pages/Design";
import Careers from "./pages/Careers";

function AppContent() {

const locomotiveScroll = new LocomotiveScroll();
  const pageRef = useRef<HTMLDivElement>(null);
  const [lenis, setLenis] = useState<Lenis | null>(null);
  const location = useLocation();

  useEffect(() => {
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
  }, []);

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
          <Route path="/" element={<HomePage lenis={lenis} />} />
        </Routes>
      </div>
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
