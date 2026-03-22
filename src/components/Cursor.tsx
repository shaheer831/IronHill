import { useEffect, useRef } from "react";

export default function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const pos = useRef({ x: -100, y: -100 });
  const dotPos = useRef({ x: -100, y: -100 });
  const raf = useRef<number>(0);

  useEffect(() => {
    const isSmallScreen = window.innerWidth < 768;

    if (isSmallScreen) {
      if (dotRef.current) dotRef.current.style.display = "none";
      return;
    }

    const move = (e: MouseEvent) => {
      pos.current = { x: e.clientX, y: e.clientY };
    };

    const hover = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const isHover = !!target.closest(
        "a, button, [data-hover], .btn-primary, .btn-outline, .clickable, [role='button'], input[type='submit'], input[type='button'], select, summary"
      );
      dotRef.current?.classList.toggle("hovered", isHover);
    };

    const animate = () => {
      dotPos.current.x += (pos.current.x - dotPos.current.x) * 0.12;
      dotPos.current.y += (pos.current.y - dotPos.current.y) * 0.12;

      if (dotRef.current) {
        dotRef.current.style.left = dotPos.current.x + "px";
        dotRef.current.style.top = dotPos.current.y + "px";
      }

      raf.current = requestAnimationFrame(animate);
    };

    window.addEventListener("mousemove", move);
    window.addEventListener("mouseover", hover);
    raf.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseover", hover);
      cancelAnimationFrame(raf.current);
    };
  }, []);

  return <div id="cursor-dot" ref={dotRef} />;
}
