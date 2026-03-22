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
      <section data-scroll data-scroll-section data-scroll-speed=".2" className="hero-detail-section" ref={detailRef}>
        <div className="hero-detail-inner">
          <div className="hero-detail-label detail-animate">
            <span>Our philosophy</span>
          </div>
          <div className="hero-detail-text">
            <p className="detail-animate">
              We don't build structures. We build permanence — the kind that endures long after trends shift and the people who commissioned the work have retired. Every project is conceived with one premise: what we erect today must be worthy of the skyline it joins and the decades of use it will reliably serve. From groundbreaking to grand opening, every person who touches our work brings full skill, full attention, and full pride to the job.
            </p>
            <p className="detail-animate">
              Since 1998, the nation's most demanding clients — developers with complex timelines, government agencies with zero tolerance for delays — have trusted us to deliver. Not once have we handed over a project late. Not once have we asked a client to absorb an unexpected overrun. That record is the product of obsessive planning and disciplined execution — structures that don't just meet the brief but honour it.
            </p>
          </div>
          <div className="hero-detail-stats">
            {[
              { num: "500+", label: "Projects completed" },
              { num: "26", label: "Years of excellence" },
              { num: "0", label: "Missed deadlines" },
              { num: "100%", label: "Client retention" },
            ].map(({ num, label }) => (
              <div key={label} className="detail-stat detail-animate">
                <span className="detail-stat-num">{num}</span>
                <span className="detail-stat-label">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
