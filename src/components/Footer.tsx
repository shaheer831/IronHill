const monoSm: React.CSSProperties = {
  fontFamily: '"Space Mono", monospace',
  fontSize: "0.6rem",
  textTransform: "uppercase",
  letterSpacing: "0.12rem",
  color: "var(--base-300)",
};

const linkStyle: React.CSSProperties = {
  fontFamily: '"Space Grotesk", sans-serif',
  fontSize: "0.875rem",
  color: "var(--base-200)",
  textDecoration: "none",
  display: "block",
  transition: "color 0.2s",
};

const divider: React.CSSProperties = {
  width: "100%",
  height: "1px",
  backgroundColor: "rgba(255,255,255,0.06)",
};

export function Footer() {
  const year = new Date().getFullYear();

  const navLinks = [
    { label: "Home",     href: "/" },
    { label: "Projects", href: "/projects" },
    { label: "Services", href: "/services" },
    { label: "About",    href: "/about" },
    { label: "Contact",  href: "/contact" },
  ];

  const socials = [
    { label: "LinkedIn",  href: "#" },
    { label: "Instagram", href: "#" },
    { label: "Behance",   href: "#" },
  ];

  return (
    <footer
      style={{
        backgroundColor: "var(--base-400)",
        borderTop: "1px solid rgba(255,255,255,0.06)",
        padding:
          "clamp(3rem, 8vw, 6rem) var(--page-padding) clamp(1.5rem, 4vw, 2.5rem)",
        color: "var(--base-100)",
        fontFamily: '"Space Grotesk", sans-serif',
      }}
    >
      {/*
        Both rows use the same two-column grid: 1fr | auto.
        This locks the right edge of CTA and Office to the same X position.
      */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr auto",
          alignItems: "start",
          columnGap: "clamp(2rem, 6vw, 5rem)",
        }}
      >
        {/* ── Row 1 LEFT: Wordmark ── */}
        <div style={{ marginBottom: "clamp(2rem, 5vw, 3.5rem)" }}>
          <h2
            style={{
              fontFamily: '"Big Shoulders Display", sans-serif',
              fontWeight: 900,
              fontSize: "clamp(3rem, 7vw, 7rem)",
              lineHeight: 0.9,
              letterSpacing: "-0.05rem",
              textTransform: "uppercase",
              color: "var(--base-100)",
            }}
          >
            Ironhill
          </h2>
          <p style={{ ...monoSm, letterSpacing: "0.15rem", marginTop: "0.75rem" }}>
            Built to endure. Engineered to exceed.
          </p>
        </div>

        {/* ── Row 1 RIGHT: CTA ── */}
        <div style={{ textAlign: "left", marginBottom: "clamp(2rem, 5vw, 3.5rem)" }}>
          <p style={{ ...monoSm, marginBottom: "0.75rem" }}>Start a project</p>
          <a
            href="mailto:build@ironhill.com"
            style={{
              fontFamily: '"Space Grotesk", sans-serif',
              fontSize: "clamp(1rem, 1.8vw, 1.25rem)",
              fontWeight: 500,
              color: "var(--base-100)",
              textDecoration: "none",
              borderBottom: "1px solid rgba(255,255,255,0.25)",
              paddingBottom: "2px",
              transition: "border-color 0.2s",
              display: "inline-block",
            }}
            onMouseEnter={(e) =>
              ((e.target as HTMLElement).style.borderColor = "var(--base-500)")
            }
            onMouseLeave={(e) =>
              ((e.target as HTMLElement).style.borderColor = "rgba(255,255,255,0.25)")
            }
          >
            build@ironhill.com
          </a>
          <p
            style={{
              fontFamily: '"Space Mono", monospace',
              fontSize: "0.72rem",
              color: "var(--base-300)",
              marginTop: "0.5rem",
            }}
          >
            +1 (212) 555-0182
          </p>
        </div>

        {/* ── Divider spans full grid ── */}
        <div
          style={{
            ...divider,
            gridColumn: "1 / -1",
            marginBottom: "clamp(1.5rem, 4vw, 2.5rem)",
          }}
        />

        {/* ── Row 2 LEFT: Nav + Follow ── */}
        <div
          style={{
            display: "flex",
            gap: "clamp(3rem, 8vw, 8rem)",
            flexWrap: "wrap",
            marginBottom: "clamp(2rem, 5vw, 4rem)",
          }}
        >
          {/* Nav */}
          <div>
            <p style={{ ...monoSm, marginBottom: "1rem" }}>Navigation</p>
            <nav style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  style={linkStyle}
                  onMouseEnter={(e) =>
                    ((e.target as HTMLElement).style.color = "var(--base-100)")
                  }
                  onMouseLeave={(e) =>
                    ((e.target as HTMLElement).style.color = "var(--base-200)")
                  }
                >
                  {link.label}
                </a>
              ))}
            </nav>
          </div>

          {/* Follow */}
          <div>
            <p style={{ ...monoSm, marginBottom: "1rem" }}>Follow</p>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  style={linkStyle}
                  onMouseEnter={(e) =>
                    ((e.target as HTMLElement).style.color = "var(--base-100)")
                  }
                  onMouseLeave={(e) =>
                    ((e.target as HTMLElement).style.color = "var(--base-200)")
                  }
                >
                  {s.label}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* ── Row 2 RIGHT: Office — same column as CTA above ── */}
        <div
          style={{
            textAlign: "left",
            marginBottom: "clamp(2rem, 5vw, 4rem)",
          }}
        >
          <p style={{ ...monoSm, marginBottom: "1rem" }}>Office</p>
          <p
            style={{
              fontFamily: '"Space Mono", monospace',
              fontSize: "0.72rem",
              lineHeight: 1.8,
              color: "var(--base-300)",
            }}
          >
            123 Steel Tower Ave
            <br />
            New York, NY 10001
            <br />
            United States
          </p>
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: "0.5rem",
              marginTop: "1.25rem",
              flexWrap: "wrap",
            }}
          >
            {["Est. 1998", "ISO 9001", "LEED Gold"].map((badge) => (
              <span
                key={badge}
                style={{
                  fontFamily: '"Space Mono", monospace',
                  fontSize: "0.55rem",
                  textTransform: "uppercase",
                  letterSpacing: "0.08rem",
                  color: "var(--base-300)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "4px",
                  padding: "3px 8px",
                }}
              >
                {badge}
              </span>
            ))}
          </div>
        </div>

        {/* ── Divider spans full grid ── */}
        <div
          style={{
            ...divider,
            gridColumn: "1 / -1",
            marginBottom: "clamp(1rem, 2.5vw, 1.5rem)",
          }}
        />

        {/* ── Bottom bar spans full grid ── */}
        <div
          style={{
            gridColumn: "1 / -1",
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "0.75rem",
          }}
        >
          <p style={monoSm}>© {year} Ironhill Construction. All rights reserved.</p>
          <p style={monoSm}>License No. NYCB-2024-7741</p>
        </div>
      </div>
    </footer>
  );
}