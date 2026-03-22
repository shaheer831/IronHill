import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import gsap from "gsap";
import "./Testimonials.css";

gsap.registerPlugin(ScrollTrigger);

const TESTIMONIALS = [
  {
    initial: "R",
    quote:
      "IronHill delivered our headquarters ahead of schedule without compromising an inch of quality. The structural precision and site management were unlike anything we'd experienced on a project of this scale.",
    name: "Robert Harlan",
    role: "CEO · Harlan Group",
    avatar:
      "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&auto=format&fit=crop&q=80",
    tag: "Commercial",
  },
  {
    initial: "S",
    quote:
      "From the first site assessment to the final handover, the IronHill team was transparent, methodical, and deeply professional. Our residential complex exceeded every expectation we had going in.",
    name: "Sarah Okonkwo",
    role: "Director · Meridian Realty",
    avatar:
      "https://images.unsplash.com/photo-1573496799652-408c2ac9fe98?w=200&auto=format&fit=crop&q=80",
    tag: "Residential",
  },
  {
    initial: "M",
    quote:
      "We brought IronHill in on a complex civil infrastructure contract that two other firms had walked away from. They assessed it, planned it, and executed it to the letter. Remarkable team.",
    name: "Marcus Vidal",
    role: "Project Lead · CityLink",
    avatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&auto=format&fit=crop&q=80",
    tag: "Civil",
  },
];

const CARD_INITIAL_X = [200, 100, 80]; // % translateX start positions

export default function Testimonials() {
  const scrollRootRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const slotRefs = useRef<HTMLDivElement[]>([]);
  const initialRefs = useRef<HTMLDivElement[]>([]);
  const cardRefs = useRef<HTMLDivElement[]>([]);

  const entranceTriggerRef = useRef<ScrollTrigger | null>(null);
  const cardTriggerRef = useRef<ScrollTrigger | null>(null);

  useGSAP(() => {
    const isMobile = () => window.innerWidth <= 768;

    function init() {
      entranceTriggerRef.current?.kill();
      cardTriggerRef.current?.kill();

      if (isMobile()) {
        // Clear any desktop transforms
        slotRefs.current.forEach((s) => gsap.set(s, { clearProps: "all" }));
        initialRefs.current.forEach((el) => gsap.set(el, { clearProps: "all" }));
        cardRefs.current.forEach((c) => gsap.set(c, { clearProps: "all" }));
        return;
      }

      // ── Set initial desktop states ──────────────────────────────────────
      slotRefs.current.forEach((s) => gsap.set(s, { y: "100%" }));
      initialRefs.current.forEach((el) => gsap.set(el, { scale: 0 }));
      cardRefs.current.forEach((c, i) => {
        gsap.set(c, {
          x: `${CARD_INITIAL_X[i]}%`,
          y: "-50%",
          scale: 0.75,
          rotation: 20,
          width: "calc(100% + 2px)",
          height: "calc(100% + 2px)",
          marginLeft: "-1px",
          marginTop: "-1px",
        });
      });

      // ── Phase 1: slots rise up (scrubbed) ───────────────────────────────
      entranceTriggerRef.current = ScrollTrigger.create({
        trigger: scrollRootRef.current,
        start: "top bottom",
        end: "top top",
        scrub: 1,
        onUpdate: (self) => {
          const prog = self.progress;
          slotRefs.current.forEach((s, i) => {
            const delay = 0.06 * i;
            const dur = 0.7;
            const p = Math.max(0, Math.min(1, (prog - delay) / dur));
            gsap.set(s, { y: `${100 - p * 100}%` });

            const letterP = Math.max(0, Math.min(1, (p - 0.4) / 0.6));
            gsap.set(initialRefs.current[i], { scale: letterP });
          });
        },
      });

      // ── Phase 2: cards slide in (pinned) ────────────────────────────────
      cardTriggerRef.current = ScrollTrigger.create({
        trigger: scrollRootRef.current,
        start: "top top",
        end: `+=${window.innerHeight * 4}`,
        pin: stickyRef.current,
        scrub: 1,
        onUpdate: (self) => {
          const prog = self.progress;
          cardRefs.current.forEach((c, i) => {
            // slide in
            const stagger = 0.075 * i;
            const slideDur = 0.4;
            const slideP = Math.max(
              0,
              Math.min(1, (prog - stagger) / slideDur)
            );
            const curX =
              CARD_INITIAL_X[i] + slideP * (-50 - CARD_INITIAL_X[i]);
            const curRot = 20 - slideP * 20;

            // scale up
            const scaleStart = 0.4 + i * 0.12;
            const scaleP = Math.max(
              0,
              Math.min(1, (prog - scaleStart) / (1 - scaleStart))
            );
            const curScale = 0.75 + scaleP * 0.25;

            gsap.set(c, { x: `${curX}%`, rotation: curRot, scale: curScale });
          });
        },
      });
    }

    let resizeTimer: ReturnType<typeof setTimeout>;
    const onResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        init();
        ScrollTrigger.refresh();
      }, 250);
    };

    window.addEventListener("resize", onResize);
    init();

    return () => {
      window.removeEventListener("resize", onResize);
      entranceTriggerRef.current?.kill();
      cardTriggerRef.current?.kill();
    };
  }, { scope: scrollRootRef });

  return (
    <section className="testimonials">
      <div className="testimonials-scroll-root" ref={scrollRootRef}>
        <div className="testimonials-sticky" ref={stickyRef}>

          {/* ── Header ── */}
          <div className="testimonials-header">
            <div className="testimonials-header-left">
              <span className="testimonials-tag">Client Voices</span>
              <h2 className="testimonials-title">
                What they<br />say about<br />us
              </h2>
            </div>
            <span className="testimonials-count">03 testimonials</span>
          </div>

          {/* ── Cards stage ── */}
          <div className="testimonials-stage">
            {TESTIMONIALS.map((t, i) => (
              <div
                key={i}
                className="t-slot"
                ref={(el) => { if (el) slotRefs.current[i] = el; }}
              >
                {/* Initial letter */}
                <div
                  className="t-initial"
                  ref={(el) => { if (el) initialRefs.current[i] = el; }}
                >
                  {t.initial}
                </div>

                {/* Card */}
                <div
                  className="t-card"
                  ref={(el) => { if (el) cardRefs.current[i] = el; }}
                >
                  <div className="t-card-top">
                    <div className="t-quote-mark">"</div>
                    <p className="t-quote-text">{t.quote}</p>
                  </div>
                  <div className="t-card-bottom">
                    <div className="t-avatar">
                      <img src={t.avatar} alt={t.name} />
                    </div>
                    <div className="t-client-info">
                      <span className="t-client-name">{t.name}</span>
                      <span className="t-client-meta">{t.role}</span>
                    </div>
                    <span className="t-project-tag">{t.tag}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
