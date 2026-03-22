import { useRef } from "react";
import { Link } from "react-router-dom";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import gsap from "gsap";
import "./CTABanner.css";

gsap.registerPlugin(ScrollTrigger);

export default function CTABanner() {
  const sectionRef = useRef<HTMLElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!innerRef.current) return;

    gsap.fromTo(
      innerRef.current.querySelectorAll(
        ".cta-tag, .cta-headline, .cta-sub, .cta-btn, .cta-stat"
      ),
      { y: 32, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 1,
        stagger: 0.09,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          once: true,
        },
      }
    );
  }, { scope: sectionRef });

  return (
    <section className="cta-section" ref={sectionRef}>
      {/* Decorative background number */}
      <span className="cta-bg-number" aria-hidden="true">25+</span>

      <div className="cta-inner" ref={innerRef}>

        {/* Top row */}
        <div className="cta-top-row">
          <span className="cta-tag">Let's Build Together</span>
          <span className="cta-stat">Est. 1998 · 500+ Projects Delivered</span>
        </div>

        {/* Headline */}
        <h2 className="cta-headline">
          Start Your<br />
          <em>Next</em> Project<br />
          With Us
        </h2>

        {/* Bottom row */}
        <div className="cta-bottom-row">
          <p className="cta-sub">
            Every project begins with a free site assessment and a fixed-fee
            proposal. No hidden costs, no surprises — just a clear path from
            foundation to handover.
          </p>
          <Link to="/contact" className="cta-btn">
            Start a Project
            <span className="cta-btn-arrow" aria-hidden="true">→</span>
          </Link>
        </div>

      </div>
    </section>
  );
}
