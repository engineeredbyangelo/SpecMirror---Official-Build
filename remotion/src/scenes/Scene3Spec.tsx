import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";

const INDIGO = "#4a6cf7";
const EMERALD = "#34d399";
const CARD_BG = "rgba(255,255,255,0.03)";
const CARD_BORDER = "rgba(255,255,255,0.08)";
const MUTED = "#71717a";

const BRIEF_LINES = [
  "I want to build a fitness tracking app for",
  "personal trainers and their clients. Trainers",
  "can create custom workout plans, track client",
  "progress, and handle payments. Clients get a",
  "mobile app to log workouts and see their stats.",
];

const SkeletonLine = ({ width, delay, frame }: { width: number; delay: number; frame: number }) => {
  const shimmerPos = interpolate((frame - delay) % 60, [0, 60], [-100, 200]);
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

// Confidence ring component
const ConfidenceRing = ({ frame, fps }: { frame: number; fps: number }) => {
  const progress = spring({ frame: frame - 30, fps, config: { damping: 30, stiffness: 40 } });
  const percent = Math.round(progress * 94);
  const circumference = 2 * Math.PI * 42;
  const dashOffset = circumference * (1 - progress * 0.94);
  const opacity = interpolate(frame, [25, 35], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <div style={{ opacity, display: "flex", flexDirection: "column", alignItems: "center", marginTop: 20 }}>
      <svg width="110" height="110" viewBox="0 0 110 110">
        <circle cx="55" cy="55" r="42" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="6" />
        <circle
          cx="55"
          cy="55"
          r="42"
          fill="none"
          stroke={EMERALD}
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          transform="rotate(-90 55 55)"
        />
        <text x="55" y="55" textAnchor="middle" dominantBaseline="central" fill="white" fontSize="22" fontWeight="700" fontFamily="Inter, sans-serif">
          {percent}%
        </text>
      </svg>
      <span style={{ fontSize: 12, color: MUTED, marginTop: 8, letterSpacing: "0.05em" }}>CONFIDENCE</span>
    </div>
  );
};

export const Scene3Generation: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const panelScale = spring({ frame: frame - 3, fps, config: { damping: 20, stiffness: 120 } });
  const panelOpacity = interpolate(panelScale, [0, 0.5], [0, 1], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        fontFamily: "Inter, sans-serif",
      }}
    >
      <div
        style={{
          display: "flex",
          gap: 32,
          transform: `scale(${Math.min(panelScale, 1)})`,
          opacity: panelOpacity,
        }}
      >
        {/* LEFT: Completed brief */}
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
              Product Brief
            </span>
          </div>
          {BRIEF_LINES.map((line, i) => (
            <div key={i} style={{ fontSize: 18, color: "white", lineHeight: 1.8 }}>
              {line}
            </div>
          ))}
        </div>

        {/* CENTER divider */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8 }}>
          <div style={{ width: 1, height: 60, background: "rgba(255,255,255,0.06)" }} />
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 10,
              background: `linear-gradient(135deg, ${INDIGO}30, ${EMERALD}30)`,
              border: "1px solid rgba(255,255,255,0.1)",
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

        {/* RIGHT: Skeleton + generating */}
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
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: EMERALD }} />
            <span style={{ fontSize: 12, color: MUTED, textTransform: "uppercase", letterSpacing: "0.12em", fontWeight: 600 }}>
              Technical Mirror
            </span>
            <span style={{ fontSize: 11, color: EMERALD, marginLeft: "auto", opacity: interpolate(Math.sin(frame * 0.1), [-1, 1], [0.4, 1]) }}>
              ● Generating...
            </span>
          </div>

          <SkeletonLine width={340} delay={8} frame={frame} />
          <SkeletonLine width={290} delay={13} frame={frame} />
          <SkeletonLine width={370} delay={18} frame={frame} />
          <SkeletonLine width={250} delay={23} frame={frame} />
          <SkeletonLine width={310} delay={28} frame={frame} />
          <SkeletonLine width={200} delay={33} frame={frame} />

          <ConfidenceRing frame={frame} fps={fps} />
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          bottom: 60,
          fontSize: 15,
          color: MUTED,
          opacity: interpolate(frame, [40, 55], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
        }}
      >
        Generating technical specification...
      </div>
    </AbsoluteFill>
  );
};
