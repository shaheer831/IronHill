import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import gsap from "gsap";
import "./FAQ.css";

gsap.registerPlugin(ScrollTrigger);

const FAQS = [
  {
    q: "How long does a typical project take from consultation to handover?",
    a: "Timelines vary by scope — a residential build typically runs 8–14 months, while large commercial or civil projects can span 18–36 months. Every engagement starts with a detailed project schedule so you know the milestones before ground breaks.",
  },
  {
    q: "Do you provide a fixed-fee proposal or do costs vary during the build?",
    a: "We work on fixed-fee proposals. After the site assessment, you receive a fully itemised quote with no hidden costs. Any scope changes are agreed in writing before work proceeds, so there are never surprise invoices at handover.",
  },
  {
    q: "What certifications and safety standards does IronHill operate under?",
    a: "IronHill holds LEED certification, ISO 9001 quality management accreditation, and full compliance with local and international occupational health and safety standards. Our crews are certified and our sites are independently audited.",
  },
  {
    q: "Can IronHill handle projects outside the local region?",
    a: "Yes. We have delivered projects across multiple regions and have the logistics and site-management infrastructure to mobilise nationally. Contact us with your project location and we'll confirm feasibility and any travel considerations upfront.",
  },
  {
    q: "What happens if issues arise after the project is handed over?",
    a: "Every IronHill project is covered by a structural warranty and a dedicated post-handover support period. If any defects or issues surface, our team responds within 48 hours. We stand behind our work long after the keys are handed over.",
  },
  {
    q: "How do I get started with IronHill?",
    a: "Start by submitting a project enquiry through our Contact page. We'll schedule a no-obligation site assessment, assess feasibility, and deliver a fixed-fee proposal — usually within 7 business days of the first meeting.",
  },
];

export default function FAQ() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  useGSAP(() => {
    if (!headerRef.current || !listRef.current) return;

    gsap.fromTo(
      headerRef.current.children,
      { y: 24, opacity: 0 },
      {
        y: 0, opacity: 1, duration: 0.9, stagger: 0.1, ease: "power3.out",
        scrollTrigger: { trigger: sectionRef.current, start: "top 75%", once: true },
      }
    );

    gsap.fromTo(
      listRef.current.querySelectorAll(".faq-item"),
      { y: 20, opacity: 0 },
      {
        y: 0, opacity: 1, duration: 0.7, stagger: 0.08, ease: "power3.out",
        scrollTrigger: { trigger: listRef.current, start: "top 80%", once: true },
      }
    );
  }, { scope: sectionRef });

  const toggle = (i: number) => setOpenIdx(openIdx === i ? null : i);

  return (
    <section className="faq-section" ref={sectionRef}>
      <div className="faq-inner">

        {/* ── Left ── */}
        <div className="faq-header" ref={headerRef}>
          <span className="faq-tag">FAQ</span>
          <h2 className="faq-title">Common<br />Questions</h2>
          <p className="faq-sub">
            Everything you need to know before starting a project with IronHill.
          </p>
          <Link to="/contact" className="faq-contact-link">
            Ask something else →
          </Link>
        </div>

        {/* ── Right ── */}
        <div className="faq-list" ref={listRef}>
          {FAQS.map((item, i) => (
            <div
              key={i}
              className={`faq-item${openIdx === i ? " open" : ""}`}
            >
              <button className="faq-question" onClick={() => toggle(i)}>
                <span className="faq-q-text">{item.q}</span>
                <span className="faq-icon">
                  <svg viewBox="0 0 12 12">
                    <line x1="6" y1="1" x2="6" y2="11" />
                    <line x1="1" y1="6" x2="11" y2="6" />
                  </svg>
                </span>
              </button>
              <div className="faq-answer-wrap">
                <p className="faq-answer">{item.a}</p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
