import { useEffect, useRef, useState } from "react";
import "./VirtualTour.css";

const TOTAL_FRAMES = 760;

const VirtualTour = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const parentRef = useRef<HTMLDivElement>(null);
  const framesRef = useRef({ currentIndex: 0 });
  const allImagesRef = useRef<HTMLImageElement[]>([]);

  const [loadedCount, setLoadedCount] = useState(0);
  const [isReady, setIsReady] = useState(false);

  // Draw a specific frame onto the canvas
  const loadImage = (index: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;

    const img = allImagesRef.current[index];
    if (!img) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const scale = Math.max(canvas.width / img.width, canvas.height / img.height);
    const newWidth = img.width * scale;
    const newHeight = img.height * scale;
    const offsetX = (canvas.width - newWidth) / 2;
    const offsetY = (canvas.height - newHeight) / 2;

    context.clearRect(0, 0, canvas.width, canvas.height);
    context.drawImage(img, offsetX, offsetY, newWidth, newHeight);
  };

  // Preload all frames
  useEffect(() => {
    let loaded = 0;
    const images: HTMLImageElement[] = [];

    for (let i = 41; i <= 800; i++) {
  const img = new Image();
  img.src = `/Assets/VideoFrames/frame_${String(i).padStart(4, "0")}.jpeg`;

  img.onload = img.onerror = () => {
    loaded++;
    setLoadedCount(loaded);
    if (loaded === TOTAL_FRAMES) {
      setIsReady(true);
    }
  };

  images.push(img);
}

    allImagesRef.current = images;
  }, []);

  // Start GSAP animation once all images are loaded
  useEffect(() => {
    if (!isReady) return;

    loadImage(0);

    // Dynamically import GSAP so it's only loaded when needed
    const initGsap = async () => {
      const { default: gsap } = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);

      gsap.to(framesRef.current, {
        currentIndex: TOTAL_FRAMES,
        ease: "none",
        scrollTrigger: {
          trigger: parentRef.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 2,
        },
        onUpdate: () => loadImage(Math.floor(framesRef.current.currentIndex)),
      });
    };

    initGsap();
  }, [isReady]);

  const progress = Math.round((loadedCount / TOTAL_FRAMES) * 100);

  return (
    <div className="vt-root">
      {/* ── Loader overlay ── */}
      {!isReady && (
        <div className="vt-loader">
          <div className="vt-loader__inner">
            <div className="vt-loader__label">Loading Tour</div>

            <div className="vt-loader__track">
              <div
                className="vt-loader__fill"
                style={{ width: `${progress}%` }}
              />
            </div>

            <div className="vt-loader__stats">
              <span className="vt-loader__count">
                {loadedCount} / {TOTAL_FRAMES}
              </span>
              <span className="vt-loader__percent">{progress}%</span>
            </div>
          </div>
        </div>
      )}

      {/* ── Main scroll container ── */}
      <div className="vt-bg">
        <div ref={parentRef} className="vt-parent">
          <div className="vt-sticky">
            <canvas ref={canvasRef} className="vt-canvas" id="frame" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default VirtualTour;