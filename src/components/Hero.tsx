import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

gsap.registerPlugin(ScrollTrigger);

interface HeroProps {
  lenis: Lenis | null;
}

const MARQUEE_ITEMS = [
  "Ironhill",
  " ◦ ",
  "Ironhill",
  " ◦ ",
  "Ironhill",
  " ◦ ",
];

export function Hero({ lenis }: HeroProps) {
  const heroRef = useRef<HTMLElement>(null);
  const marqueeWrapRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const detailRef = useRef<HTMLDivElement>(null);
  const currentX = useRef(0);
  const baseSpeed = useRef(1.6);

  // Entry animations
  useEffect(() => {
    if (!heroRef.current) return;
    gsap.fromTo(
      heroRef.current.querySelectorAll(".hero-animate"),
      { y: 40, opacity: 0 },
      { y: 0, opacity: 1, duration: 1.1, stagger: 0.13, ease: "power3.out", delay: 0.15 }
    );
  }, []);
  // Marquee RAF loop — constant speed
  useEffect(() => {
    if (!trackRef.current) return;

    let animFrame: number;

    const cloneContent = () => {
      const track = trackRef.current!;
      const existing = track.querySelectorAll(".marquee-clone");
      existing.forEach((el) => el.remove());
      const originalItems = Array.from(track.querySelectorAll(".marquee-original"));
      // enough copies to fill 4× viewport
      const singleW = originalItems.reduce((acc, el) => acc + (el as HTMLElement).offsetWidth, 0);
      const needed = Math.ceil((window.innerWidth * 4) / singleW) + 1;
      for (let i = 0; i < needed; i++) {
        originalItems.forEach((item) => {
          const clone = item.cloneNode(true) as HTMLElement;
          clone.classList.remove("marquee-original");
          clone.classList.add("marquee-clone");
          track.appendChild(clone);
        });
      }
    };

    // Wait a frame so fonts are measured correctly
    const init = requestAnimationFrame(() => {
      cloneContent();

      const tick = () => {
        currentX.current -= baseSpeed.current;

        const track = trackRef.current!;
        const originals = track.querySelectorAll(".marquee-original");
        if (!originals.length) { animFrame = requestAnimationFrame(tick); return; }

        let totalW = 0;
        originals.forEach((el) => { totalW += (el as HTMLElement).offsetWidth; });

        if (Math.abs(currentX.current) >= totalW) {
          currentX.current += totalW;
        }

        gsap.set(track, { x: currentX.current });
        animFrame = requestAnimationFrame(tick);
      };

      animFrame = requestAnimationFrame(tick);
    });

    return () => {
      cancelAnimationFrame(init);
      cancelAnimationFrame(animFrame);
    };
  }, []);

  return (
    <>
      {/* ── HERO ── */}
      <section data-scroll data-scroll-section data-scroll-speed="-.3" className="hero" ref={heroRef}>
        {/* Background */}
        <div className="absolute inset-0 w-full h-full">
          <img src="/hero-img.jpg" alt="Ironhill construction project" />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to bottom, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.35) 50%, rgba(0,0,0,0.82) 100%)",
            }}
          />
        </div>

        {/* Centered hero content */}
        <div className="absolute inset-x-0 top-0 h-full flex flex-col justify-center items-center gap-2 text-center px-6">
          <h1
            className="uppercase leading-[0.9] tracking-[-0.1rem] hero-animate"
            style={{
              fontFamily: '"Big Shoulders Display", sans-serif',
              fontWeight: 900,
              fontSize: "clamp(3.5rem, 9vw, 11rem)",
            }}
          >
            Ironhill
          </h1>
          <p
            className="text-base-200 text-center hero-animate"
            style={{
              fontFamily: '"Space Grotesk", sans-serif',
              fontSize: "clamp(0.9rem, 1.8vw, 1.125rem)",
              width: "min(75%, 520px)",
            }}
          >
            Built to endure. Engineered to exceed.
          </p>
          <div className="flex gap-3 mt-4 flex-wrap justify-center hero-animate">
            {["Est. 1998", "500+ Projects", "LEED Certified"].map((badge) => (
              <span
                key={badge}
                className="border border-white/15 text-base-300 bg-black rounded-md"
                style={{
                  fontFamily: '"Space Mono", monospace',
                  fontSize: "clamp(0.55rem, 1.2vw, 0.7rem)",
                  textTransform: "uppercase",
                  letterSpacing: "0.1rem",
                  padding: "3px 8px",
                }}
              >
                {badge}
              </span>
            ))}
          </div>
        </div>
      </section>
      {/* ── MARQUEE — pinned to bottom, parallax on scroll ── */}
      {/* Outer wrapper: padding-y + overflow hidden = clips the inner bordered strip */}
      <div data-scroll data-scroll-section data-scroll-speed=".1" className="marquee-outer hero-animate" ref={marqueeWrapRef}>
        {/* Inner strip: top + bottom border, big height */}
        <div className="marquee-inner">
          <div className="marquee-track" ref={trackRef}>
            {MARQUEE_ITEMS.map((item, i) => (
              <span key={i} className="marquee-item marquee-original">
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>
      {/* ── DETAIL SECTION ── */}
      <section
        data-scroll
        data-scroll-section
        data-scroll-speed=".2"
        ref={detailRef}
        className="hero-detail-section flex flex-col items-center justify-center text-center gap-12 px-4 md:px-10 lg:px-20 py-28 md:py-36 lg:py-44 bg-neutral-950 text-white"
      >
        <p className="text-3xl md:text-4xl lg:text-5xl leading- max-w-[90vw] text-neutral-200">
          IronHill <div className="h-12 w-24 rounded-full inline-block translate-y-[15%] overflow-hidden">
            <img className="hover:scale-125 duration-500 transition-all cursor-pointer" src="https://images.unsplash.com/photo-1587145679823-331021ad6864?q=80&w=2524&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="" />
          </div> is built on strength, precision, and a vision to shape spaces that last. We approach every project with a commitment to quality, ensuring that each structure reflects durability, efficiency, and thoughtful design. From residential builds    <div className="h-12 w-24 rounded-full inline-block translate-y-[15%] overflow-hidden">
            <img className="hover:scale-125 duration-500 transition-all cursor-pointer" src="https://images.unsplash.com/photo-1448630360428-65456885c650?q=80&w=1734&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="" />
          </div> to large-scale commercial
      
          developments, our work stands as a testament to reliability and modern construction standards.
        </p>

        <p className="text-3xl md:text-4xl lg:text-5xl leading max-w-[90vw] text-neutral-200">
          Our process combines experience with innovation, allowing us to deliver projects that meet the evolving needs of communities <div className="h-12 w-24 rounded-full inline-block translate-y-[15%] overflow-hidden">
            <img className="hover:scale-125 duration-500 transition-all cursor-pointer" src="https://images.unsplash.com/photo-1502444330042-d1a1ddf9bb5b?q=80&w=1746&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="" />
          </div> and businesses. We focus on creating environments that are not only functional but also enduring, built with purpose and attention to every detail. At IronHill, construction is more than building — it is about creating a foundation <div className="h-12 w-24 rounded-full inline-block translate-y-[15%] overflow-hidden">
            <img className="hover:scale-125 duration-500 transition-all cursor-pointer" src="https://images.unsplash.com/photo-1586726370832-3440a511e479?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="" />
          </div> for the future.
        </p>
      </section>
    </>
  );
}
