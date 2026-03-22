import { useEffect, useRef } from "react";
import gsap from "gsap";

// All images used across the app (local + remote) — deduplicated
const IMAGE_URLS = [
  "/hero-img.jpg",
  "/d.jpg",
  // Hero detail inline images
  "https://images.unsplash.com/photo-1587145679823-331021ad6864?q=80&w=2524&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1448630360428-65456885c650?q=80&w=1734&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1502444330042-d1a1ddf9bb5b?q=80&w=1746&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1586726370832-3440a511e479?q=80&w=1740&auto=format&fit=crop",
  // Spotlight rows
  "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=900&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=900&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=900&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1590644365607-b1e3ec5a9f38?w=900&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=900&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=900&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=900&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=900&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=900&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1508450859948-4e04fabaa4ea?w=900&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=900&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1503387837-b154d5074bd2?w=900&auto=format&fit=crop&q=80",
  // Renovation row — second unique image (was duplicated before)
  "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=900&auto=format&fit=crop&q=80",
];

function loadImage(src: string): Promise<void> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = () => resolve(); // never block on a failed asset
    img.src = src;
  });
}

function loadFonts(): Promise<void> {
  if (!document.fonts) return Promise.resolve();
  return document.fonts.ready.then(() => undefined);
}

interface PreloaderProps {
  onComplete: () => void;
}

export default function Preloader({ onComplete }: PreloaderProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  // Track whether the component is still mounted to avoid calling onComplete
  // after an unmount (e.g. HMR / StrictMode double-invoke)
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    const total = IMAGE_URLS.length;
    let loadedCount = 0;

    const tick = () => {
      if (!mountedRef.current) return;
      loadedCount += 1;
      const pct = Math.round((loadedCount / total) * 100);
      // Drive progress purely via DOM refs — no React state re-renders needed
      if (counterRef.current) counterRef.current.textContent = `${pct}`;
      if (barRef.current) barRef.current.style.transform = `scaleX(${pct / 100})`;
    };

    const allLoads = Promise.all([
      loadFonts(),
      ...IMAGE_URLS.map((url) => loadImage(url).then(tick)),
    ]);

    allLoads.then(() => {
      if (!mountedRef.current) return;
      // Small grace period so the bar visually reaches 100 before exit
      setTimeout(() => {
        if (!mountedRef.current) return;
        if (!overlayRef.current) { onComplete(); return; }
        gsap.to(overlayRef.current, {
          yPercent: -100,
          duration: 0.85,
          ease: "power3.inOut",
          onComplete: () => {
            if (mountedRef.current) onComplete();
          },
        });
      }, 250);
    });

    return () => {
      mountedRef.current = false;
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // intentionally empty — runs once; onComplete is stable via useCallback in App

  return (
    <div
      ref={overlayRef}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 99999,
        backgroundColor: "var(--base-400)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "2rem",
      }}
    >
      {/* Wordmark */}
      <h1
        style={{
          fontFamily: '"Big Shoulders Display", sans-serif',
          fontWeight: 900,
          fontSize: "clamp(3rem, 10vw, 7rem)",
          textTransform: "uppercase",
          letterSpacing: "-0.05rem",
          lineHeight: 1,
          color: "var(--base-100)",
          userSelect: "none",
        }}
      >
        Ironhill
      </h1>

      {/* Progress bar track */}
      <div
        style={{
          width: "clamp(200px, 40vw, 380px)",
          height: "1px",
          backgroundColor: "rgba(255,255,255,0.12)",
          overflow: "hidden",
        }}
      >
        <div
          ref={barRef}
          style={{
            width: "100%",
            height: "100%",
            backgroundColor: "var(--base-500)",
            transformOrigin: "left center",
            transform: "scaleX(0)",
            transition: "transform 0.25s ease-out",
          }}
        />
      </div>

      {/* Counter */}
      <span
        ref={counterRef}
        style={{
          fontFamily: '"Space Mono", monospace',
          fontSize: "0.65rem",
          letterSpacing: "0.18rem",
          textTransform: "uppercase",
          color: "var(--base-300)",
          userSelect: "none",
        }}
      >
        0
      </span>
    </div>
  );
}
