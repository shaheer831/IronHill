import "./Menu.css";
import { useRef, useState, useEffect } from "react";
import { gsap } from "gsap";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";
import Lenis from "lenis";
import { useNavigate, useLocation } from "react-router-dom";

gsap.registerPlugin(useGSAP, SplitText);

interface MenuProps {
  lenis: Lenis | null;
}

const menuItems = [
  { label: "Home",     route: "/" },
  { label: "Studio",   route: "/studio" },
  { label: "Work",     route: "/work" },
  { label: "Design",   route: "/design" },
  { label: "News",     route: "/news" },
  { label: "Advisory", route: "/advisory" },
  { label: "Contact",  route: "/contact" },
  { label: "Careers",  route: "/careers" },
];

function createSVGOverlay() {
  let overlay = document.querySelector(".page-transition-overlay") as HTMLElement | null;
  if (!overlay) {
    overlay = document.createElement("div");
    overlay.className = "page-transition-overlay";
    overlay.innerHTML = `
      <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
        <path class="overlay__path" vector-effect="non-scaling-stroke" d="M 0 0 h 0 c 0 50 0 50 0 100 H 0 V 0 Z" />
      </svg>
    `;
    document.body.appendChild(overlay);
  }
  return overlay;
}

const Menu = ({ lenis }: MenuProps) => {
  const navToggleRef          = useRef<HTMLDivElement>(null);
  const menuOverlayRef        = useRef<HTMLDivElement>(null);
  const menuImageRef          = useRef<HTMLImageElement>(null);
  const menuLinksWrapperRef   = useRef<HTMLDivElement>(null);
  const linkHighlighterRef    = useRef<HTMLDivElement>(null);
  const menuLinksRef          = useRef<(HTMLAnchorElement | null)[]>([]);
  const menuLinkContainersRef = useRef<(HTMLDivElement | null)[]>([]);
  const openLabelRef          = useRef<HTMLParagraphElement>(null);
  const closeLabelRef         = useRef<HTMLParagraphElement>(null);
  const menuColsRef           = useRef<(HTMLDivElement | null)[]>([]);

  // FIX 1: Use a single API style (new SplitText) everywhere for consistent revert()
  const splitTextInstances    = useRef<InstanceType<typeof SplitText>[]>([]);
  const menuColSplitInstances = useRef<InstanceType<typeof SplitText>[]>([]);

  const [isMenuOpen,      setIsMenuOpen]      = useState(false);
  const [isMenuAnimating, setIsMenuAnimating] = useState(false);

  // Store animating state in a ref so closures always see the latest value
  const isMenuAnimatingRef = useRef(false);
  const isMenuOpenRef      = useRef(false);

  const navigate = useNavigate();
  const location = useLocation();

  const currentX   = useRef(0);
  const targetX    = useRef(0);
  const lerpFactor = 0.05;

  const currentHX = useRef(0);
  const targetHX  = useRef(0);
  const currentHW = useRef(0);
  const targetHW  = useRef(0);

  const animFrameRef = useRef<number>(0);

  // Keep refs in sync with state so GSAP callbacks read fresh values
  useEffect(() => { isMenuAnimatingRef.current = isMenuAnimating; }, [isMenuAnimating]);
  useEffect(() => { isMenuOpenRef.current      = isMenuOpen;      }, [isMenuOpen]);

  const runPageTransition = (href: string) => {
    const overlay     = createSVGOverlay();
    const overlayPath = overlay.querySelector(".overlay__path") as SVGPathElement | null;
    if (!overlayPath) return;

    const paths = {
      step1: {
        unfilled:  "M 0 0 h 0 c 0 50 0 50 0 100 H 0 V 0 Z",
        inBetween: "M 0 0 h 43 c -60 55 140 65 0 100 H 0 V 0 Z",
        filled:    "M 0 0 h 100 c 0 50 0 50 0 100 H 0 V 0 Z",
      },
      step2: {
        filled:    "M 100 0 H 0 c 0 50 0 50 0 100 h 100 V 50 Z",
        inBetween: "M 100 0 H 50 c 28 43 4 81 0 100 h 50 V 0 Z",
        unfilled:  "M 100 0 H 100 c 0 50 0 50 0 100 h 0 V 0 Z",
      },
    };

    const tl = gsap.timeline({
      onComplete: () => { if (overlay?.parentNode) overlay.parentNode.removeChild(overlay); },
    });

    tl.set(overlayPath, { attr: { d: paths.step1.unfilled } })
      .to(overlayPath, { duration: 0.6, ease: "power4.in", attr: { d: paths.step1.inBetween } }, 0)
      .to(overlayPath, {
        duration: 0.2, ease: "power1", attr: { d: paths.step1.filled },
        onComplete: () => { navigate(href); },
      })
      .to({}, { duration: 0.75 })
      .set(overlayPath, { attr: { d: paths.step2.filled } })
      .to(overlayPath, { duration: 0.15, ease: "sine.in", attr: { d: paths.step2.inBetween } })
      .to(overlayPath, { duration: 1,    ease: "power4",  attr: { d: paths.step2.unfilled } });
  };

  const navigateWithTransition = (href: string) => {
    // FIX 4: Don't guard same-route before closing menu — let closeMenuThen handle it,
    // then bail inside onDone. This ensures the menu always closes even on active route.
    if (isMenuOpenRef.current) {
      closeMenuThen(() => {
        if (location.pathname !== href) runPageTransition(href);
      });
    } else {
      if (location.pathname === href) return;
      runPageTransition(href);
    }
  };

  // FIX 7: Split col text AFTER open animation completes (called from toggleMenu open path)
  //         AND revert properly before re-splitting to avoid ghost nodes.
  const splitAndResetMenuCols = () => {
    const menuCols = menuColsRef.current;
    if (!menuCols || menuCols.length === 0) return;
    menuColSplitInstances.current.forEach((s) => s.revert());
    menuColSplitInstances.current = [];
    menuCols.forEach((col) => {
      if (!col) return;
      col.querySelectorAll("p, a").forEach((el) => {
        // FIX 1: Consistent API — use `new SplitText` everywhere
        const split = new SplitText(el as HTMLElement, { type: "lines", mask: "lines", linesClass: "split-line" });
        menuColSplitInstances.current.push(split);
        gsap.set(split.lines, { y: "100%" });
      });
    });
  };

  useGSAP(
    () => {
      const menuLinks          = menuLinksRef.current;
      const menuOverlay        = menuOverlayRef.current;
      const menuLinksWrapper   = menuLinksWrapperRef.current;
      const linkHighlighter    = linkHighlighterRef.current;
      const menuImage          = menuImageRef.current;
      const menuLinkContainers = menuLinkContainersRef.current;

      if (!menuOverlay || !menuLinksWrapper || !linkHighlighter) return;

      // Split chars for each menu link
      splitTextInstances.current.forEach((s) => s.revert());
      splitTextInstances.current = [];
      menuLinks.forEach((link) => {
        if (!link) return;
        link.querySelectorAll("span").forEach((span, idx) => {
          const split = new SplitText(span, { type: "chars" });
          splitTextInstances.current.push(split);
          split.chars.forEach((c) => c.classList.add("char"));
          if (idx === 1) gsap.set(split.chars, { y: "110%" });
        });
      });

      if (menuImage) gsap.set(menuImage, { y: 0, scale: 0.5, opacity: 0.25 });
      gsap.set(menuLinks,       { y: "150%" });
      gsap.set(linkHighlighter, { y: "150%" });

      // Initialise highlighter under first link
      const firstLinkEl = menuLinksWrapper.querySelector(".menu-link:first-child") as HTMLElement | null;
      const firstSpan   = firstLinkEl?.querySelector("a span") as HTMLElement | null;
      if (firstLinkEl && firstSpan) {
        const w     = firstSpan.offsetWidth;
        const rect  = firstLinkEl.getBoundingClientRect();
        const wRect = menuLinksWrapper.getBoundingClientRect();
        const x     = rect.left - wRect.left;
        currentHX.current = x; targetHX.current = x;
        currentHW.current = w; targetHW.current = w;
        linkHighlighter.style.width = w + "px";
      }

      // Mouse parallax
      const handleMouseMove = (e: MouseEvent) => {
        if (window.innerWidth < 1000) return;
        const vw = window.innerWidth;
        const ww = menuLinksWrapper.offsetWidth;
        const sr = vw * 0.5;
        const sx = (vw - sr) / 2;
        const ex = sx + sr;
        const pct = e.clientX <= sx ? 0 : e.clientX >= ex ? 1 : (e.clientX - sx) / sr;
        targetX.current = pct * (vw - ww);
      };

      // Link hover: char swap + highlighter
      menuLinkContainers.forEach((link) => {
        if (!link) return;
        const onEnter = () => {
          if (window.innerWidth < 1000) return;
          const spans = link.querySelectorAll("a span");
          if (spans.length < 2) return;
          const vis  = (spans[0] as HTMLElement).querySelectorAll(".char");
          const anim = (spans[1] as HTMLElement).querySelectorAll(".char");
          gsap.to(vis,  { y: "-110%", stagger: 0.05, duration: 0.5, ease: "expo.inOut" });
          gsap.to(anim, { y:    "0%", stagger: 0.05, duration: 0.5, ease: "expo.inOut" });
          const lr  = link.getBoundingClientRect();
          const wr  = menuLinksWrapper.getBoundingClientRect();
          targetHX.current = lr.left - wr.left;
          const sp = link.querySelector("a span") as HTMLElement | null;
          targetHW.current = sp ? sp.offsetWidth : link.offsetWidth;
        };
        const onLeave = () => {
          if (window.innerWidth < 1000) return;
          const spans = link.querySelectorAll("a span");
          if (spans.length < 2) return;
          const vis  = (spans[0] as HTMLElement).querySelectorAll(".char");
          const anim = (spans[1] as HTMLElement).querySelectorAll(".char");
          gsap.to(anim, { y: "110%", stagger: 0.05, duration: 0.5, ease: "expo.inOut" });
          gsap.to(vis,  { y:   "0%", stagger: 0.05, duration: 0.5, ease: "expo.inOut" });
        };
        link.addEventListener("mouseenter", onEnter);
        link.addEventListener("mouseleave", onLeave);
        (link as any)._onEnter = onEnter;
        (link as any)._onLeave = onLeave;
      });

      // Reset highlighter when leaving whole nav
      const onWrapperLeave = () => {
        const first = menuLinksWrapper.querySelector(".menu-link:first-child") as HTMLElement | null;
        if (!first) return;
        const sp = first.querySelector("a span") as HTMLElement | null;
        if (!sp) return;
        const lr = first.getBoundingClientRect();
        const wr = menuLinksWrapper.getBoundingClientRect();
        targetHX.current = lr.left - wr.left;
        targetHW.current = sp.offsetWidth;
      };

      menuOverlay.addEventListener("mousemove", handleMouseMove);
      menuLinksWrapper.addEventListener("mouseleave", onWrapperLeave);

      // FIX 5: RAF loop uses gsap.set (not gsap.to) for lerped values to avoid
      //         spawning hundreds of concurrent tweens every frame.
      const loop = () => {
        currentX.current  += (targetX.current  - currentX.current)  * lerpFactor;
        currentHX.current += (targetHX.current - currentHX.current) * lerpFactor;
        currentHW.current += (targetHW.current - currentHW.current) * lerpFactor;
        const isMobile = window.innerWidth <= 768;
        if (!isMobile) {
          gsap.set(menuLinksWrapper, { x: currentX.current });
          gsap.set(linkHighlighter,  { x: currentHX.current, width: currentHW.current });
        }
        animFrameRef.current = requestAnimationFrame(loop);
      };
      loop();

      return () => {
        cancelAnimationFrame(animFrameRef.current);
        menuOverlay.removeEventListener("mousemove", handleMouseMove);
        menuLinksWrapper.removeEventListener("mouseleave", onWrapperLeave);
        menuLinkContainers.forEach((link) => {
          if (!link) return;
          if ((link as any)._onEnter) link.removeEventListener("mouseenter", (link as any)._onEnter);
          if ((link as any)._onLeave) link.removeEventListener("mouseleave", (link as any)._onLeave);
        });
        splitTextInstances.current.forEach((s) => { if (s?.revert) s.revert(); });
        splitTextInstances.current = [];
      };
    },
    { scope: menuOverlayRef }
  );

  // Lock scroll when menu open
  useEffect(() => {
    if (!lenis) return;
    isMenuOpen ? lenis.stop() : lenis.start();
  }, [lenis, isMenuOpen]);

  // ─── CLOSE WITH CALLBACK ────────────────────────────────────────────────────
  const closeMenuThen = (onDone?: () => void) => {
    // FIX 2: If already animating, bail silently — do NOT call onDone prematurely.
    //         onDone is only safe to call once the close animation fully completes.
    if (!isMenuOpenRef.current || isMenuAnimatingRef.current) return;

    setIsMenuAnimating(true);
    isMenuAnimatingRef.current = true;

    const menuOverlay      = menuOverlayRef.current;
    const menuImage        = menuImageRef.current;
    const menuLinks        = menuLinksRef.current;
    const linkHighlighter  = linkHighlighterRef.current;
    const menuLinksWrapper = menuLinksWrapperRef.current;
    const openLabel        = openLabelRef.current;
    const closeLabel       = closeLabelRef.current;
    const menuCols         = menuColsRef.current;

    gsap.to(openLabel,  { y: 0,        duration: 0.6, ease: "power3.out" });
    gsap.to(closeLabel, { y: "2.5rem", duration: 0.6, ease: "power3.out" });
    if (menuImage) gsap.to(menuImage, { y: "-25svh", opacity: 0.5, duration: 1.25, ease: "expo.out" });
    menuCols.forEach((col) => {
      if (!col) return;
      gsap.to(col.querySelectorAll(".split-line"), { y: "-100%", duration: 1, stagger: 0, ease: "expo.out" });
    });

    gsap.to(menuOverlay, {
      clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)",
      duration: 1.25, ease: "expo.out",
      onComplete: () => {
        gsap.set(menuOverlay,     { clipPath: "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)" });
        gsap.set(menuLinks,       { y: "150%" });
        gsap.set(linkHighlighter, { y: "150%" });
        if (menuImage) gsap.set(menuImage, { y: "0", scale: 0.5, opacity: 0.25 });
        gsap.set(".menu-link", { overflow: "hidden" });
        menuCols.forEach((col) => {
          if (!col) return;
          gsap.set(col.querySelectorAll(".split-line"), { y: "100%" });
        });
        if (menuLinksWrapper) {
          gsap.set(menuLinksWrapper, { x: 0, clearProps: window.innerWidth <= 768 ? "transform" : "" });
          currentX.current = 0;
          targetX.current  = 0;
        }
        setIsMenuOpen(false);
        isMenuOpenRef.current = false;
        setIsMenuAnimating(false);
        isMenuAnimatingRef.current = false;
        onDone?.(); // FIX 2: onDone fires only after animation fully completes
      },
    });
  };

  // ─── TOGGLE ────────────────────────────────────────────────────────────────
  const toggleMenu = () => {
    // FIX 3: Single guard using ref (not state) to prevent double-firing
    if (isMenuAnimatingRef.current) return;

    const menuOverlay      = menuOverlayRef.current;
    const menuImage        = menuImageRef.current;
    const menuLinks        = menuLinksRef.current;
    const linkHighlighter  = linkHighlighterRef.current;
    const menuLinksWrapper = menuLinksWrapperRef.current;
    const openLabel        = openLabelRef.current;
    const closeLabel       = closeLabelRef.current;
    const menuCols         = menuColsRef.current;

    if (!isMenuOpenRef.current) {
      // ── OPEN ──
      setIsMenuAnimating(true);
      isMenuAnimatingRef.current = true;

      gsap.to(openLabel,  { y: "-2.5rem", duration: 0.6, ease: "power3.out" });
      gsap.to(closeLabel, { y:        0,  duration: 0.6, ease: "power3.out" });

      // FIX 7: Split col text fresh on every open so lines are ready to animate
      splitAndResetMenuCols();

      gsap.to(menuOverlay, {
        clipPath: "polygon(0% 100%, 100% 100%, 100% 0%, 0% 0%)",
        duration: 1.25, ease: "expo.out",
        onComplete: () => {
          gsap.set(".menu-link", { overflow: "visible" });
          setIsMenuOpen(true);
          isMenuOpenRef.current = true;
          setIsMenuAnimating(false);
          isMenuAnimatingRef.current = false;
        },
      });

      if (menuImage) gsap.to(menuImage, { scale: 1, opacity: 1, duration: 1.5, ease: "expo.out" });
      gsap.to(menuLinks,       { y: "0%", duration: 1.25, stagger: 0.1, delay: 0.25, ease: "expo.out" });
      gsap.to(linkHighlighter, { y: "0%", duration: 1,    delay: 1,     ease: "expo.out" });

      menuCols.forEach((col) => {
        if (!col) return;
        gsap.to(col.querySelectorAll(".split-line"), { y: "0%", duration: 1, stagger: 0.05, delay: 0.5, ease: "expo.out" });
      });

    } else {
      // ── CLOSE ── FIX 3: No state flicker — closeMenuThen sets animating itself
      closeMenuThen();
    }
  };

  return (
    <>
      {/* Nav bar */}
      <nav
        className="fixed top-0 left-0 w-full flex justify-between items-center z-[100]"
        style={{ maxWidth: "100vw", padding: "9px 12px" }}
      >
        <span style={{
          fontSize:"24px"
        }}>Logo.</span>
        <div ref={navToggleRef} onClick={toggleMenu} className="nav-toggle-wrapper" style={{ background: "#2641aa" }}>
          <p ref={openLabelRef}  className="open-label"  style={{ color: "white" }}>menu</p>
          <p ref={closeLabelRef} className="close-label" style={{ color: "white" }}>Close</p>
        </div>
      </nav>

      {/* Full-screen menu overlay */}
      <div className="menu-overlay" ref={menuOverlayRef}>

        {/* Info columns */}
        <div
          className="menu-info-cols absolute w-full flex justify-between items-start"
          style={{ top: "45%", transform: "translateY(-50%)", padding: "0 clamp(1.5rem, 4vw, 3.5rem)" }}
        >
          {/* Col 1 */}
          <div className="flex flex-col gap-6" ref={(el) => { menuColsRef.current[0] = el; }}>
            {[
              [["© Ironhill Construction"], ["123 Steel Tower Ave"], ["New York, NY 10001"]],
              [["Est. 1998"], ["Licensed & Insured"]],
              [["Say Hello"], ["build@ironhill.com"]],
              [["Hotline"], ["+1 (212) 555-0182"]],
            ].map((group, gi) => (
              <div key={gi} className="flex flex-col gap-1">
                {group.map(([text], ti) =>
                  ti === 1 && gi === 2 ? (
                    <a
                      key={ti}
                      href="mailto:build@ironhill.com"
                      className="block overflow-hidden"
                      style={{ fontFamily: '"Space Mono", monospace', fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.05rem", color: "#929292" }}
                    >
                      {text}
                    </a>
                  ) : (
                    <p
                      key={ti}
                      className="block overflow-hidden"
                      style={{ fontFamily: '"Space Mono", monospace', fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.05rem", color: "#929292" }}
                    >
                      {text}
                    </p>
                  )
                )}
              </div>
            ))}
          </div>

          {/* Col 2 */}
          <div className="flex flex-col gap-6 text-right" ref={(el) => { menuColsRef.current[1] = el; }}>
            <div className="flex flex-col gap-1">
              <p style={{ fontFamily: '"Space Mono", monospace', fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.05rem", color: "#929292" }}>Follow</p>
              <a href="#" target="_blank" rel="noreferrer" style={{ fontFamily: '"Space Mono", monospace', fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.05rem", color: "#929292" }}>LinkedIn</a>
              <a href="#" target="_blank" rel="noreferrer" style={{ fontFamily: '"Space Mono", monospace', fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.05rem", color: "#929292" }}>Instagram</a>
            </div>
            <div className="flex flex-col gap-1">
              <p style={{ fontFamily: '"Space Mono", monospace', fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.05rem", color: "#929292" }}>Certifications</p>
              <p style={{ fontFamily: '"Space Mono", monospace', fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.05rem", color: "#929292" }}>ISO 9001:2015</p>
              <p style={{ fontFamily: '"Space Mono", monospace', fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.05rem", color: "#929292" }}>LEED Gold Partner</p>
            </div>
            <div className="flex flex-col gap-1">
              <p style={{ fontFamily: '"Space Mono", monospace', fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.05rem", color: "#929292" }}>License No.</p>
              <p style={{ fontFamily: '"Space Mono", monospace', fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.05rem", color: "#929292" }}>NYCB-2024-7741</p>
            </div>
          </div>
        </div>

        {/* Centre image */}
        <div
          className="absolute hidden md:block"
          style={{ top: "45%", left: "50%", transform: "translate(-50%, -50%)", width: "160px", aspectRatio: "5/7" }}
        >
          <img
            ref={menuImageRef}
            src="/hero-img.jpg"
            alt="Construction site"
            className="w-full h-full rounded-[2px] object-cover"
            style={{ filter: "grayscale(30%)" }}
          />
        </div>

        {/* Giant nav links */}
        <div
          className="menu-links-mobile absolute left-0 bottom-0 flex gap-6"
          style={{ width: "max-content", padding: "clamp(1.25rem, 3vw, 2rem) clamp(1.5rem, 4vw, 3.5rem)" }}
          ref={menuLinksWrapperRef}
        >
          {menuItems.map((item, index) => (
            <div
              key={item.label}
              className="menu-link"
              ref={(el) => { menuLinkContainersRef.current[index] = el; }}
              onClick={(e) => {
                e.preventDefault();
                navigateWithTransition(item.route);
              }}
            >
              {/* FIX 6: href="#" prevents native navigation; routing is handled entirely
                          by the parent div's onClick via navigateWithTransition */}
              <a
                href="#"
                ref={(el) => { menuLinksRef.current[index] = el; }}
                onClick={(e) => e.preventDefault()}
              >
                <span>{item.label}</span>
                <span>{item.label}</span>
              </a>
            </div>
          ))}
          <div className="link-highlighter" ref={linkHighlighterRef} />
        </div>

        {/* Mobile-only footer strip */}
        <div className="menu-mobile-footer">
          <div>
            <p>© Ironhill Construction</p>
            <a href="mailto:build@ironhill.com">build@ironhill.com</a>
          </div>
          <div style={{ textAlign: "right" }}>
            <a href="#">LinkedIn</a>
            <p style={{ marginTop: "0.25rem" }}>Instagram</p>
          </div>
        </div>

      </div>
    </>
  );
};

export default Menu;