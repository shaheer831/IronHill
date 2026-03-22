import { useRef } from "react";
import { Link } from "react-router-dom";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import gsap from "gsap";
import "./VirtualTourSection.css";

gsap.registerPlugin(ScrollTrigger);

export default function VirtualTourSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // Subtle parallax on background + content fade-in
  useGSAP(() => {
    if (!sectionRef.current || !contentRef.current) return;

    // Content reveal
    gsap.fromTo(
      contentRef.current.children,
      { y: 30, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 1,
        stagger: 0.12,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
          once: true,
        },
      }
    );
  }, { scope: sectionRef });

  return (
    <section className="vt-section" ref={sectionRef}>
      <Link to="/virtual-tour" className="vt-inner">

        {/* ── Background image ── */}
        <div className="vt-bg" ref={bgRef}>
          <img
            src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1800&auto=format&fit=crop&q=80"
            alt="IronHill construction site"
          />
          <div className="vt-overlay" />
        </div>

        {/* ── Corner coordinates ── */}
        <span className="vt-coords vt-coords-tl">36°51'N · 76°17'W</span>
        <span className="vt-coords vt-coords-tr">IH — Site 07</span>
        <span className="vt-coords vt-coords-bl">Virtual Walkthrough</span>
        <span className="vt-coords vt-coords-br">4K · 360°</span>

        {/* ── Content ── */}
        <div className="vt-content" ref={contentRef}>
          <span className="vt-tag">Immersive Experience</span>

          <h2 className="vt-title">
            Virtual<br />Tour
          </h2>

          <p className="vt-sub">
            Step inside our active project sites. A fully immersive 360° walkthrough
            of IronHill's construction process — from foundation pour to final handover.
          </p>

          <div className="vt-play-btn">
            <div className="vt-play-icon">
              <svg viewBox="0 0 12 12" xmlns="http://www.w3.org/2000/svg">
                <polygon points="2,1 11,6 2,11" />
              </svg>
            </div>
            Enter Tour
          </div>
        </div>

      </Link>
    </section>
  );
}
