import "./Spotlight.css";
import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SplitType from "split-type";

gsap.registerPlugin(useGSAP, ScrollTrigger);

// Construction project showcase data
const MARQUEE_ROWS: {
  id: string;
  images: { src: string; alt: string }[];
  text: string;
  textPosition: number; // index where the text item appears
}[] = [
  {
    id: "marquee-1",
    text: "Structural",
    textPosition: 1,
    images: [
      { src: "/spotlight/spotlight-1.jpg", alt: "IronHill steel framework" },
      { src: "/spotlight/spotlight-2.jpg", alt: "Foundation work" },
      { src: "/spotlight/spotlight-3.jpg", alt: "Concrete pour" },
      { src: "/spotlight/spotlight-4.jpg", alt: "High-rise skeleton" },
    ],
  },
  {
    id: "marquee-2",
    text: "Precision",
    textPosition: 3,
    images: [
      { src: "/spotlight/spotlight-5.jpg", alt: "Blueprint review" },
      { src: "/spotlight/spotlight-6.jpg", alt: "Laser alignment" },
      { src: "/spotlight/spotlight-7.jpg", alt: "Survey equipment" },
      { src: "/spotlight/spotlight-8.jpg", alt: "Quality control check" },
    ],
  },
  {
    id: "marquee-3",
    text: "Ironhill",
    textPosition: 1,
    images: [
      { src: "/spotlight/spotlight-9.jpg", alt: "Completed commercial build" },
      { src: "/spotlight/spotlight-10.jpg", alt: "IronHill facade" },
      { src: "/spotlight/spotlight-11.jpg", alt: "Residential development" },
      { src: "/spotlight/spotlight-12.jpg", alt: "Industrial complex" },
    ],
  },
  {
    id: "marquee-4",
    text: "Endures",
    textPosition: 3,
    images: [
      { src: "/spotlight/spotlight-13.jpg", alt: "Decade-old IronHill build" },
      { src: "/spotlight/spotlight-14.jpg", alt: "Long-span bridge detail" },
      { src: "/spotlight/spotlight-15.jpg", alt: "Weathered steel detail" },
      { src: "/spotlight/spotlight-16.jpg", alt: "Landmark structure" },
    ],
  },
];

const Spotlight: React.FC = () => {
  const spotlightRef = useRef<HTMLElement | null>(null);

  useGSAP(
    () => {
      const scrollTriggerInstances: ScrollTrigger[] = [];

      const initSpotlight = (): void => {
        new SplitType(".marquee-text-item h1", { types: "chars" });

        document
          .querySelectorAll<HTMLElement>(".marquee-container")
          .forEach((container, index) => {
            const marquee = container.querySelector<HTMLElement>(".marquee");
            const chars =
              container.querySelectorAll<HTMLElement>(".char");

            if (!marquee) return;

            const marqueeTrigger = gsap.to(marquee, {
              x: index % 2 === 0 ? "5%" : "-15%",
              scrollTrigger: {
                trigger: container,
                start: "top bottom",
                end: "150% top",
                scrub: true,
              },
              force3D: true,
            });

            const charsTrigger = gsap.fromTo(
              chars,
              { fontWeight: 100 },
              {
                fontWeight: 900,
                duration: 1,
                ease: "none",
                stagger: {
                  each: 0.35,
                  from: index % 2 === 0 ? "end" : "start",
                  ease: "linear",
                },
                scrollTrigger: {
                  trigger: container,
                  start: "50% bottom",
                  end: "top top",
                  scrub: true,
                },
              }
            );

            if (marqueeTrigger.scrollTrigger) {
              scrollTriggerInstances.push(marqueeTrigger.scrollTrigger);
            }
            if (charsTrigger.scrollTrigger) {
              scrollTriggerInstances.push(charsTrigger.scrollTrigger);
            }
          });

        ScrollTrigger.refresh();
      };

      const waitForOtherTriggers = (): void => {
        const existingTriggers = ScrollTrigger.getAll();
        const hasPinnedTrigger = existingTriggers.some(
          (trigger) => trigger.vars && trigger.vars.pin
        );

        if (hasPinnedTrigger || existingTriggers.length > 0) {
          setTimeout(initSpotlight, 300);
        } else {
          initSpotlight();
        }
      };

      setTimeout(waitForOtherTriggers, 100);

      return () => {
        scrollTriggerInstances.forEach((trigger) => trigger.kill());
      };
    },
    { scope: spotlightRef }
  );

  return (
    <section className="spotlight" ref={spotlightRef}>
      {/* Section header */}
      <div className="spotlight-header">
        <span className="spotlight-label">Our Work</span>
        <p className="spotlight-tagline">
          500+ projects. Every structure a statement.
        </p>
      </div>

      <div className="marquees">
        {MARQUEE_ROWS.map((row, rowIndex) => {
          // Build the items array, inserting text at the right position
          const items: React.ReactNode[] = [];
          let imgIdx = 0;

          for (let i = 0; i < row.images.length + 1; i++) {
            if (i === row.textPosition) {
              items.push(
                <div key="text" className="marquee-img-item marquee-text-item">
                  <h1>{row.text}</h1>
                </div>
              );
            } else {
              const img = row.images[imgIdx++];
              items.push(
                <div key={imgIdx} className="marquee-img-item">
                  <img src={img.src} alt={img.alt} />
                </div>
              );
            }
          }

          return (
            <div
              className="marquee-container"
              id={row.id}
              key={row.id}
              // Odd rows (0-indexed) get an accent stripe
              data-row={rowIndex}
            >
              <div className="marquee">{items}</div>
            </div>
          );
        })}
      </div>

      {/* Bottom stat strip */}
      <div className="spotlight-stats">
        {[
          { num: "500+", label: "Projects Delivered" },
          { num: "26", label: "Years in Industry" },
          { num: "12", label: "States Active" },
          { num: "98%", label: "On-Time Completion" },
        ].map((stat) => (
          <div className="spotlight-stat" key={stat.label}>
            <span className="spotlight-stat-num">{stat.num}</span>
            <span className="spotlight-stat-label">{stat.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Spotlight;