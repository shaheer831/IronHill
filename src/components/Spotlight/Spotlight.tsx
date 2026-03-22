"use client";
import "./Spotlight.css";
import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import SplitType from "split-type";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const Spotlight: React.FC = () => {
  const spotlightRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const scrollTriggerInstances: ScrollTrigger[] = [];

      const initSpotlight = (): void => {
        new SplitType(".marquee-text-item h1", { types: "chars" });

        document
          .querySelectorAll<HTMLElement>(".marquee-container")
          .forEach((container, index) => {
            const marquee = container.querySelector<HTMLElement>(".marquee");
            const chars = container.querySelectorAll<HTMLElement>(".char");

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

      {/* ── Services header ── */}
      <div className="services-header">
        <div className="services-header-top">
          <span className="services-tag">Our Services</span>
          <p className="services-count">04 disciplines</p>
        </div>
        <div className="services-header-body">
          <h2 className="services-title">
            What we<br />build for you
          </h2>
          <p className="services-description">
            From foundation to finish, IronHill delivers four core disciplines
            that cover every phase of the build cycle. Each service is backed
            by 25+ years of site experience, certified crews, and an
            uncompromising standard for quality that outlasts the project.
          </p>
        </div>
      </div>

      <div className="marquees">
        {/* Row 1 — Commercial Construction */}
        <div className="marquee-container" id="marquee-1">
          <div className="marquee">
            <div className="marquee-img-item">
              <img src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=900&auto=format&fit=crop&q=80" alt="Commercial high-rise construction" />
            </div>
            <div className="marquee-img-item marquee-text-item">
              <h1>Commercial</h1>
            </div>
            <div className="marquee-img-item">
              <img src="https://images.unsplash.com/photo-1486325212027-8081e485255e?w=900&auto=format&fit=crop&q=80" alt="Modern office building" />
            </div>
            <div className="marquee-img-item">
              <img src="https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=900&auto=format&fit=crop&q=80" alt="Steel structure workers" />
            </div>
            <div className="marquee-img-item">
              <img src="https://images.unsplash.com/photo-1590644365607-b1e3ec5a9f38?w=900&auto=format&fit=crop&q=80" alt="Construction crane" />
            </div>
          </div>
        </div>

        {/* Row 2 — Residential Development */}
        <div className="marquee-container" id="marquee-2">
          <div className="marquee">
            <div className="marquee-img-item">
              <img src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=900&auto=format&fit=crop&q=80" alt="Luxury residential build" />
            </div>
            <div className="marquee-img-item">
              <img src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=900&auto=format&fit=crop&q=80" alt="Modern house facade" />
            </div>
            <div className="marquee-img-item">
              <img src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=900&auto=format&fit=crop&q=80" alt="Residential framing" />
            </div>
            <div className="marquee-img-item marquee-text-item">
              <h1>Residential</h1>
            </div>
            <div className="marquee-img-item">
              <img src="https://images.unsplash.com/photo-1448630360428-65456885c650?w=900&auto=format&fit=crop&q=80" alt="Housing development" />
            </div>
          </div>
        </div>

        {/* Row 3 — Civil & Infrastructure */}
        <div className="marquee-container" id="marquee-3">
          <div className="marquee">
            <div className="marquee-img-item">
              <img src="https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=900&auto=format&fit=crop&q=80" alt="Civil infrastructure bridge" />
            </div>
            <div className="marquee-img-item marquee-text-item">
              <h1>Civil</h1>
            </div>
            <div className="marquee-img-item">
              <img src="https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=900&auto=format&fit=crop&q=80" alt="Road construction" />
            </div>
            <div className="marquee-img-item">
              <img src="https://images.unsplash.com/photo-1508450859948-4e04fabaa4ea?w=900&auto=format&fit=crop&q=80" alt="Underground utilities" />
            </div>
            <div className="marquee-img-item">
              <img src="https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=900&auto=format&fit=crop&q=80" alt="Foundation concrete pour" />
            </div>
          </div>
        </div>

        {/* Row 4 — Renovation & Fit-Out */}
        <div className="marquee-container" id="marquee-4">
          <div className="marquee">
            <div className="marquee-img-item">
              <img src="https://images.unsplash.com/photo-1503387837-b154d5074bd2?w=900&auto=format&fit=crop&q=80" alt="Interior renovation" />
            </div>
            <div className="marquee-img-item">
              <img src="https://images.unsplash.com/photo-1587145679823-331021ad6864?w=900&auto=format&fit=crop&q=80" alt="Commercial fit-out" />
            </div>
            <div className="marquee-img-item">
              <img src="https://images.unsplash.com/photo-1586726370832-3440a511e479?w=900&auto=format&fit=crop&q=80" alt="Renovated interior space" />
            </div>
            <div className="marquee-img-item marquee-text-item">
              <h1>Renovation</h1>
            </div>
            <div className="marquee-img-item">
              <img src="https://images.unsplash.com/photo-1502444330042-d1a1ddf9bb5b?w=900&auto=format&fit=crop&q=80" alt="Finishing and fit-out work" />
            </div>
          </div>
        </div>

      </div>

      {/* ── Services footer ── */}
      <div className="services-footer">
        <p className="services-footer-note">
          Every engagement begins with a site assessment, detailed project
          schedule, and a fixed-fee proposal — no hidden costs, no surprises.
        </p>
        <a href="/contact" className="services-cta">
          Start a project <span aria-hidden="true">→</span>
        </a>
      </div>

    </section>
  );
};

export default Spotlight;
