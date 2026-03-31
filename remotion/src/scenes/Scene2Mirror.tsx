import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";

const INDIGO = "#4a6cf7";
const EMERALD = "#34d399";
const CARD_BG = "rgba(255,255,255,0.03)";
const CARD_BORDER = "rgba(255,255,255,0.08)";
const MUTED = "#71717a";
const DIM = "#a1a1aa";

const BRIEF_LINES = [
  "Build a mobile-first task manager",
  "with real-time team collaboration,",
  "offline support, and role-based",
  "access for enterprise teams.",
];

const SPEC_SECTIONS = [
  { label: "Architecture", value: "React 18 + Supabase + PWA" },
  { label: "Authentication", value: "Email + Google OAuth + RBAC" },
  { label: "Real-time layer", value: "Supabase Realtime (WebSocket)" },
  { label: "Offline strategy", value: "IndexedDB + service worker sync" },
  { label: "Deployment", value: "Vercel Edge + CDN" },
  { label: "Confidence", value: "94%", accent: true },
];

const SkeletonLine = ({ width, delay, frame }: { width: number; delay: number; frame: number }) => {
  const shimmerPos = interpolate(
    (frame - delay) % 60,
    [0, 60],
    [-100, 200],
  );
  const opacity = interpolate(frame, [delay, delay + 8], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        opacity,
        height: 14,
        width,
        borderRadius: 6,
        background: "rgba(255,255,255,0.06)",
        marginBottom: 14,
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.04) 50%, transparent 100%)`,
          transform: `translateX(${shimmerPos}%)`,
        }}
      />
    </div>
  );
};

export const Scene2Mirror: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Panel entrance
  const panelScale = spring({ frame: frame - 5, fps, config: { damping: 20, stiffness: 120 } });
  const panelOpacity = interpolate(panelScale, [0, 0.5], [0, 1], { extrapolateRight: "clamp" });

  // Divider label
  const dividerOpacity = interpolate(frame, [10, 25], [0, 1], { extrapolateRight: "clamp" });

  // Skeleton phase: frames 20-110
  // Spec reveal phase: starts at frame 110
  const skeletonFadeOut = interpolate(frame, [105, 120], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const specRevealed = frame >= 110;

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        fontFamily: "Inter, sans-serif",
      }}
    >
      {/* Header label */}
      <div
        style={{
          position: "absolute",
          top: 80,
          opacity: dividerOpacity,
          display: "flex",
          alignItems: "center",
          gap: 12,
        }}
      >
        <span style={{ fontSize: 13, fontWeight: 600, color: INDIGO, textTransform: "uppercase", letterSpacing: "0.15em" }}>
          Plain English
        </span>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={MUTED} strokeWidth="2">
          <path d="M5 12h14M12 5l7 7-7 7" />
        </svg>
        <span style={{ fontSize: 13, fontWeight: 600, color: EMERALD, textTransform: "uppercase", letterSpacing: "0.15em" }}>
          Technical Spec
        </span>
      </div>

      {/* Side-by-side panels */}
      <div
        style={{
          display: "flex",
          gap: 32,
          transform: `scale(${Math.min(panelScale, 1)})`,
          opacity: panelOpacity,
        }}
      >
        {/* LEFT: Brief panel */}
        <div
          style={{
            width: 520,
            background: CARD_BG,
            border: `1px solid ${CARD_BORDER}`,
            borderRadius: 12,
            padding: "32px 36px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: INDIGO }} />
            <span style={{ fontSize: 12, color: MUTED, textTransform: "uppercase", letterSpacing: "0.12em", fontWeight: 600 }}>
              Project Brief
            </span>
          </div>

          {BRIEF_LINES.map((line, i) => {
            const lineStart = 15 + i * 22;
            const progress = interpolate(frame, [lineStart, lineStart + 30], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            });
            const chars = Math.floor(line.length * progress);
            return (
              <div
                key={i}
                style={{
                  fontSize: 20,
                  color: "white",
                  lineHeight: 1.8,
                  minHeight: 36,
                }}
              >
                <span style={{ opacity: progress > 0 ? 1 : 0 }}>
                  {line.slice(0, chars)}
                </span>
                {progress > 0 && progress < 1 && (
                  <span
                    style={{
                      display: "inline-block",
                      width: 2,
                      height: 20,
                      background: INDIGO,
                      marginLeft: 1,
                      verticalAlign: "text-bottom",
                      opacity: Math.sin(frame * 0.3) > 0 ? 1 : 0,
                    }}
                  />
                )}
              </div>
            );
          })}
        </div>

        {/* CENTER: Mirror divider */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            opacity: dividerOpacity,
          }}
        >
          <div style={{ width: 1, height: 60, background: "rgba(255,255,255,0.06)" }} />
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 10,
              background: `linear-gradient(135deg, ${INDIGO}30, ${EMERALD}30)`,
              border: `1px solid rgba(255,255,255,0.1)`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </div>
          <div style={{ width: 1, height: 60, background: "rgba(255,255,255,0.06)" }} />
        </div>

        {/* RIGHT: Spec panel */}
        <div
          style={{
            width: 520,
            background: CARD_BG,
            border: `1px solid ${specRevealed ? `${EMERALD}30` : CARD_BORDER}`,
            borderRadius: 12,
            padding: "32px 36px",
            transition: "border-color 0.3s",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: EMERALD }} />
            <span style={{ fontSize: 12, color: MUTED, textTransform: "uppercase", letterSpacing: "0.12em", fontWeight: 600 }}>
              Technical Spec
            </span>
            {/* Generating indicator */}
            {frame >= 40 && frame < 115 && (
              <span style={{ fontSize: 11, color: EMERALD, marginLeft: "auto", opacity: interpolate(Math.sin(frame * 0.1), [-1, 1], [0.4, 1]) }}>
                ● Generating...
              </span>
            )}
            {frame >= 115 && (
              <span style={{ fontSize: 11, color: EMERALD, marginLeft: "auto" }}>
                ✓ Complete
              </span>
            )}
          </div>

          {/* Skeleton loading phase */}
          {skeletonFadeOut > 0 && (
            <div style={{ opacity: skeletonFadeOut }}>
              <SkeletonLine width={320} delay={25} frame={frame} />
              <SkeletonLine width={280} delay={30} frame={frame} />
              <SkeletonLine width={350} delay={35} frame={frame} />
              <SkeletonLine width={240} delay={40} frame={frame} />
              <SkeletonLine width={300} delay={45} frame={frame} />
              <SkeletonLine width={180} delay={50} frame={frame} />
            </div>
          )}

          {/* Actual spec reveal */}
          {specRevealed && (
            <div>
              {SPEC_SECTIONS.map((section, i) => {
                const revealDelay = 110 + i * 12;
                const s = spring({ frame: frame - revealDelay, fps, config: { damping: 18 } });
                const opacity = interpolate(s, [0, 0.4], [0, 1], { extrapolateRight: "clamp" });
                const x = interpolate(s, [0, 1], [16, 0]);

                return (
                  <div
                    key={i}
                    style={{
                      opacity,
                      transform: `translateX(${x}px)`,
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "10px 0",
                      borderBottom: i < SPEC_SECTIONS.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none",
                    }}
                  >
                    <span style={{ fontSize: 14, color: DIM }}>{section.label}</span>
                    <span
                      style={{
                        fontSize: 14,
                        fontWeight: 600,
                        color: section.accent ? EMERALD : "white",
                      }}
                    >
                      {section.value}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Bottom label */}
      <div
        style={{
          position: "absolute",
          bottom: 60,
          opacity: interpolate(frame, [130, 145], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
          fontSize: 15,
          color: MUTED,
          letterSpacing: "0.02em",
        }}
      >
        Your brief, mirrored into a production-ready spec
      </div>
    </AbsoluteFill>
  );
};
