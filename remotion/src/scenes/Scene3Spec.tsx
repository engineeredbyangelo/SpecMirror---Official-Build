import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";

const INDIGO = "#4a6cf7";
const EMERALD = "#34d399";

const SPEC_LINES = [
  { label: "Architecture", value: "React + Supabase", delay: 10 },
  { label: "Auth", value: "Email + Google OAuth", delay: 20 },
  { label: "Real-time", value: "WebSocket channels", delay: 30 },
  { label: "Storage", value: "IndexedDB + cloud sync", delay: 40 },
  { label: "Confidence", value: "92%", delay: 50, accent: true },
];

export const Scene3Spec: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const labelOpacity = interpolate(frame, [0, 12], [0, 1], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        fontFamily: "Inter, sans-serif",
      }}
    >
      {/* Label */}
      <div
        style={{
          opacity: labelOpacity,
          fontSize: 14,
          fontWeight: 600,
          color: EMERALD,
          textTransform: "uppercase",
          letterSpacing: "0.15em",
          marginBottom: 24,
        }}
      >
        Step 2 — AI generates your spec
      </div>

      {/* Spec card */}
      <div
        style={{
          width: 640,
          background: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: 12,
          padding: "32px 40px",
        }}
      >
        {SPEC_LINES.map((line, i) => {
          const s = spring({ frame: frame - line.delay, fps, config: { damping: 20 } });
          const opacity = interpolate(s, [0, 0.5], [0, 1], { extrapolateRight: "clamp" });
          const x = interpolate(s, [0, 1], [20, 0]);

          return (
            <div
              key={i}
              style={{
                opacity,
                transform: `translateX(${x}px)`,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "12px 0",
                borderBottom: i < SPEC_LINES.length - 1 ? "1px solid rgba(255,255,255,0.06)" : "none",
              }}
            >
              <span style={{ fontSize: 16, color: "#a1a1aa" }}>{line.label}</span>
              <span
                style={{
                  fontSize: 16,
                  fontWeight: 600,
                  color: line.accent ? EMERALD : "white",
                }}
              >
                {line.value}
              </span>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
