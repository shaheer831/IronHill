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
      <div className="marquees">
        <div className="marquee-container" id="marquee-1">
          <div className="marquee">
            <div className="marquee-img-item">
              <img src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&auto=format&fit=crop" alt="" />
            </div>
            <div className="marquee-img-item marquee-text-item">
              <h1>Structural</h1>
            </div>
            <div className="marquee-img-item">
              <img src="https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=800&auto=format&fit=crop" alt="" />
            </div>
            <div className="marquee-img-item">
              <img src="https://images.unsplash.com/photo-1590644365607-b1e3ec5a9f38?w=800&auto=format&fit=crop" alt="" />
            </div>
            <div className="marquee-img-item">
              <img src="https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800&auto=format&fit=crop" alt="" />
            </div>
          </div>
        </div>

        <div className="marquee-container" id="marquee-2">
          <div className="marquee">
            <div className="marquee-img-item">
              <img src="https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=800&auto=format&fit=crop" alt="" />
            </div>
            <div className="marquee-img-item">
              <img src="https://images.unsplash.com/photo-1587145679823-331021ad6864?w=800&auto=format&fit=crop" alt="" />
            </div>
            <div className="marquee-img-item">
              <img src="https://images.unsplash.com/photo-1448630360428-65456885c650?w=800&auto=format&fit=crop" alt="" />
            </div>
            <div className="marquee-img-item marquee-text-item">
              <h1>Precision</h1>
            </div>
            <div className="marquee-img-item">
              <img src="https://images.unsplash.com/photo-1503387837-b154d5074bd2?w=800&auto=format&fit=crop" alt="" />
            </div>
          </div>
        </div>

        <div className="marquee-container" id="marquee-3">
          <div className="marquee">
            <div className="marquee-img-item">
              <img src="https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=800&auto=format&fit=crop" alt="" />
            </div>
            <div className="marquee-img-item marquee-text-item">
              <h1>Ironbuilt</h1>
            </div>
            <div className="marquee-img-item">
              <img src="https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=800&auto=format&fit=crop" alt="" />
            </div>
            <div className="marquee-img-item">
              <img src="https://images.unsplash.com/photo-1508450859948-4e04fabaa4ea?w=800&auto=format&fit=crop" alt="" />
            </div>
            <div className="marquee-img-item">
              <img src="https://images.unsplash.com/photo-1502444330042-d1a1ddf9bb5b?w=800&auto=format&fit=crop" alt="" />
            </div>
          </div>
        </div>

        <div className="marquee-container" id="marquee-4">
          <div className="marquee">
            <div className="marquee-img-item">
              <img src="https://images.unsplash.com/photo-1586726370832-3440a511e479?w=800&auto=format&fit=crop" alt="" />
            </div>
            <div className="marquee-img-item">
              <img src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&auto=format&fit=crop" alt="" />
            </div>
            <div className="marquee-img-item">
              <img src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&auto=format&fit=crop" alt="" />
            </div>
            <div className="marquee-img-item marquee-text-item">
              <h1>Legacy</h1>
            </div>
            <div className="marquee-img-item">
              <img src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&auto=format&fit=crop" alt="" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Spotlight;
